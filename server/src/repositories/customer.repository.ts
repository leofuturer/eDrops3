import { Getter, inject } from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository
} from '@loopback/repository';
import { HttpErrors, Request, Response } from '@loopback/rest';
import AWS from 'aws-sdk';
import { genSalt, hash } from 'bcryptjs';
import { createHash } from 'crypto';
import path from 'path';
import { MysqlDsDataSource } from '../datasources';
import {
  EMAIL_HOSTNAME,
  EMAIL_PORT,
  EMAIL_SENDER
} from '../lib/constants/emailConstants';
import { calculate } from '../lib/toolbox/calculate';
import log from '../lib/toolbox/log';
import { DTO } from '../lib/types/model';
import {
  Customer,
  Address,
  CustomerRelations,
  FileInfo,
  OrderInfo,
  User
} from '../models';
import { STORAGE_DIRECTORY } from '../services';
import SendGrid from '../services/send-grid.service';
import { AddressRepository } from './customer-address.repository';
import { FileInfoRepository } from './file-info.repository';
import { OrderInfoRepository } from './order-info.repository';
import { UserRepository } from './user.repository';

const CONTAINER_NAME = process.env.S3_BUCKET_NAME ?? 'edrop-v2-files';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {
  public readonly addresses: HasManyRepositoryFactory<
    Address,
    typeof Customer.prototype.id
  >;

  public readonly fileInfos: HasManyRepositoryFactory<
    FileInfo,
    typeof Customer.prototype.id
  >;

  public readonly orderInfos: HasManyRepositoryFactory<
    OrderInfo,
    typeof Customer.prototype.id
  >;

  public readonly user: BelongsToAccessor<User, typeof Customer.prototype.id>;

  public readonly s3: AWS.S3;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @repository.getter('AddressRepository')
    protected AddressRepositoryGetter: Getter<AddressRepository>,
    @repository.getter('FileInfoRepository')
    protected fileInfoRepositoryGetter: Getter<FileInfoRepository>,
    @repository.getter('OrderInfoRepository')
    protected orderInfoRepositoryGetter: Getter<OrderInfoRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @inject('services.SendGrid')
    public sendGrid: SendGrid,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
  ) {
    super(Customer, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.orderInfos = this.createHasManyRepositoryFactoryFor(
      'orderInfos',
      orderInfoRepositoryGetter,
    );
    this.registerInclusionResolver(
      'orderInfos',
      this.orderInfos.inclusionResolver,
    );
    this.fileInfos = this.createHasManyRepositoryFactoryFor(
      'fileInfos',
      fileInfoRepositoryGetter,
    );
    this.registerInclusionResolver(
      'fileInfos',
      this.fileInfos.inclusionResolver,
    );
    this.addresses = this.createHasManyRepositoryFactoryFor(
      'addresses',
      AddressRepositoryGetter,
    );
    this.registerInclusionResolver(
      'addresses',
      this.addresses.inclusionResolver,
    );

    if (process.env.NODE_ENV === 'production') {
      AWS.config.update({
        accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_AWS_DEFAULT_REGION,
      });

      this.s3 = new AWS.S3();
    }
  }

  /**
   * Create a new customer and its associated user instance
   * @param customer      Customer to be created
   * @param createAddress Whether to create a default address for the customer (mainly used for initial seeding)
   * @returns             Created customer instance
   */
  async createCustomer(
    customer: DTO<Customer & User & Partial<Omit<Address, 'id'>>>,
    createAddress = true,
  ): Promise<Customer> {
    const hashedPassword = await hash(customer.password, await genSalt());
    const userData: DTO<User> = {
      id: customer.id,
      username: customer.username,
      password: hashedPassword,
      userType: 'customer',
      email: customer.email,
      emailVerified: customer.emailVerified,
      verificationToken: customer.verificationToken,
    };
    const userRepository = await this.userRepositoryGetter();
    const userInstance = await userRepository.create(userData).catch(err => {
      throw new HttpErrors.InternalServerError(err.message);
    });
    const customerData: DTO<Customer> = {
      id: userInstance.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phoneNumber: customer.phoneNumber,
      customerType: customer.customerType,
      userId: userInstance.id,
    };
    const customerInstance = await this.create(customerData).catch(err => {
      throw new HttpErrors.InternalServerError(err.message);
    });
    if (createAddress) {
      const AddressData: Partial<Address> = {
        street: customer.street || 'Not provided during signup',
        streetLine2: customer.streetLine2 || 'Not provided during signup',
        country: customer.country || 'Not provided during signup',
        state: customer.state || 'Not provided during signup',
        city: customer.city || 'Not provided during signup',
        zipCode: customer.zipCode || 'Not provided during signup',
        isDefault: customer.isDefault || true,
      };
      log.info('Customer instance created, now associating address with it');
      this.addresses(customerInstance.id)
        .create(AddressData)
        .then(() => {
          userRepository.sendVerificationEmail(userInstance);
        })
        .catch(err => {
          // roll back the customer creation
          this.deleteById(customerInstance?.id);
          console.error(err);
        });
    }
    return customerInstance;
  }

  async getCustomerCart(
    customerId: string,
  ): Promise<Partial<OrderInfo> | null> {
    return this.orderInfos(customerId)
      .find({ where: { orderComplete: false }, include: ['orderProducts', 'orderChips'] })
      .then(orders => {
        if (orders.length > 1) {
          log.error(`Error getting customer cart or there's more than one active cart`);
          throw new HttpErrors.NotFound('More than one active cart found');
        } else if (orders.length === 0) {
          log.warning(`No cart found for customer id=${customerId}, need to create one`);
          // throw new HttpErrors.NotFound('No cart found');
          return null;
        }
        log.info(`Cart already exists, is order info model with id ${orders[0].id}`);
        return orders[0];
      })
      .catch(err => {
        throw err;
      });
  }

  async uploadDisk(
    request: Request,
    response: Response,
    username: string,
    id: string,
  ): Promise<object> {
    const mapper = (f: Express.Multer.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      filename: f.filename,
    });
    // Parse multipart/form-data file info from request
    let files: Partial<Express.Multer.File>[] = [];
    const uploadedFiles = request.files;
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }

    const fileInfos: Partial<FileInfo>[] = files.map(
      (f: Partial<Express.Multer.File>) => {
        return {
          uploadTime: calculate.currentTime(),
          fileName: request.body.newName
            ? request.body.newName
            : f.originalname,
          containerFileName: f.originalname,
          container: CONTAINER_NAME, // need fix
          uploader: username,
          customerId: id,
          isDeleted: false,
          isPublic: request.body.isPublic === 'public',
          unit: request.body.unit,
          fileSize: calculate.formatBytes(f.size as number, 1),
        };
      },
    );

    const fields = request.body;
    const fileInfo = await this.fileInfos(id).create(fileInfos[0]);
    // return {files, fields};
    return { fileInfo, fields };
  }

  async uploadS3(
    request: Request,
    response: Response,
    username: string,
    id: string,
  ): Promise<object> {
    const mapper = (f: Express.MulterS3.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      key: f.key,
      metadata: f.metadata,
    });
    // Parse multipart/form-data file info from request
    let files: Partial<Express.MulterS3.File>[] = [];

    const uploadedFiles = request.files;
    if (Array.isArray(uploadedFiles)) {
      /* @ts-ignore */
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        /* @ts-ignore */
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }

    const fileInfos: Partial<FileInfo>[] = files.map(
      (f: Partial<Express.MulterS3.File>) => {
        return {
          uploadTime: calculate.currentTime(),
          fileName: request.body.newName
            ? request.body.newName
            : f.originalname,
          containerFileName: f.key,
          container: CONTAINER_NAME, // need fix
          uploader: username,
          customerId: id,
          isDeleted: false,
          isPublic: request.body.isPublic === 'public',
          unit: request.body.unit,
          fileSize: calculate.formatBytes(f.size as number, 1),
        };
      },
    );

    const fields = request.body;
    const fileInfo = await this.fileInfos(id).create(fileInfos[0]);
    // return {files, fields};
    return { fileInfo, fields };
  }

  async downloadDisk(filename: string, response: Response): Promise<Response> {
    const file = path.resolve(`${this.storageDirectory}/www/`, filename);
    if (!file.startsWith(this.storageDirectory))
      throw new HttpErrors.BadRequest(`Invalid file id: ${filename}`);
    response.download(file, filename);
    return response;
  }

  async downloadS3(filename: string, response: Response): Promise<Response> {
    const file = await this.s3
      .getObject({
        Key: filename,
        Bucket: CONTAINER_NAME,
      })
      .promise();

    response.writeHead(200, {
      'Content-Type': file.ContentType,
      'Content-Disposition': file.ContentDisposition,
    });
    response.end(file.Body);
    return response;
  }
}
