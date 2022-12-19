import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {HttpErrors, Request, Response} from '@loopback/rest';
import AWS from 'aws-sdk';
import {genSalt, hash} from 'bcryptjs';
import {createHash} from 'crypto';
import ejs from 'ejs';
import path from 'path';
import {MysqlDsDataSource} from '../datasources';
import {
  EMAIL_HOSTNAME,
  EMAIL_PORT,
  EMAIL_SENDER,
} from '../lib/constants/emailConstants';
import {calculate} from '../lib/toolbox/calculate';
import log from '../lib/toolbox/log';
import {verifyHTML} from '../lib/views/verify';
import {
  Customer,
  CustomerAddress,
  CustomerRelations,
  FileInfo,
  OrderInfo,
  User,
} from '../models';
import {STORAGE_DIRECTORY} from '../services';
import SendGrid from '../services/send-grid.service';
import {CustomerAddressRepository} from './customer-address.repository';
import {FileInfoRepository} from './file-info.repository';
import {OrderInfoRepository} from './order-info.repository';
import {UserRepository} from './user.repository';

const CONTAINER_NAME = process.env.S3_BUCKET_NAME ?? 'edrop-v2-files';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {
  public readonly customerAddresses: HasManyRepositoryFactory<
    CustomerAddress,
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
    @repository.getter('CustomerAddressRepository')
    protected customerAddressRepositoryGetter: Getter<CustomerAddressRepository>,
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
    // this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    // this.registerInclusionResolver('user', this.user.inclusionResolver);
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
    this.customerAddresses = this.createHasManyRepositoryFactoryFor(
      'customerAddresses',
      customerAddressRepositoryGetter,
    );
    this.registerInclusionResolver(
      'customerAddresses',
      this.customerAddresses.inclusionResolver,
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
    customer: Omit<Customer & CustomerAddress, 'id'>,
    createAddress: boolean = true,
  ): Promise<Customer> {
    const hashedPassword = await hash(customer.password, await genSalt());
    const userData: Partial<User> = {
      id: customer.id,
      realm: customer.realm,
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
    const customerData: Omit<Customer, 'id'> = {
      ...userInstance,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phoneNumber: customer.phoneNumber,
      customerType: customer.customerType,
      // userId: userInstance.id,
    };
    const customerInstance = await this.create(customerData).catch(err => {
      throw new HttpErrors.InternalServerError(err.message);
    });
    if (createAddress) {
      const customerAddressData: Omit<CustomerAddress, 'id'> = {
        street: customer.street || 'Not provided during signup',
        streetLine2: customer.streetLine2 || 'Not provided during signup',
        country: customer.country || 'Not provided during signup',
        state: customer.state || 'Not provided during signup',
        city: customer.city || 'Not provided during signup',
        zipCode: customer.zipCode || 'Not provided during signup',
        isDefault: customer.isDefault || true,
      };
      log.info('Customer instance created, now associating address with it');
      this.customerAddresses(customerInstance.id)
        .create(customerAddressData)
        .then(() => {
          this.sendVerificationEmail(customerInstance);
        })
        .catch(err => {
          // roll back the customer creation
          this.deleteById(customerInstance?.id);
          console.error(err);
        });
    }
    return customerInstance;
  }

  async createVerificationToken(customerId: string): Promise<string> {
    const verificationTokenHash = createHash('sha256')
      .update(customerId + Date.now().toString())
      .digest('hex');
    return this.updateById(customerId, {
      verificationToken: verificationTokenHash,
      verificationTokenExpires: new Date(Date.now() + 600000),
    }).then(() => verificationTokenHash);
  }

  async sendVerificationEmail(customer: Customer): Promise<void> {
    const verificationTokenHash = await this.createVerificationToken(
      customer.id as string,
    );

    // uncomment the next two lines to skip email verification
    // this.verifyEmail(customer.id as string, verificationTokenHash);
    // exit(0);

    const baseURL =
      process.env.NODE_ENV === 'production'
        ? `https://${EMAIL_HOSTNAME}`
        : `http://${EMAIL_HOSTNAME}:${EMAIL_PORT}`;

    // const EMAIL_TEMPLATE = ejs.render(
    //   verifyHTML,
    //   {
    //     text: `Hello ${customer.username}! Thanks for registering to use eDrops. Please verify your email by clicking on the following link:`,
    //     email: EMAIL_SENDER,
    //     verifyHref: `${baseURL}/api/customers/verify?customerId=${customer.id}&token=${verificationTokenHash}`,
    //   },
    //   {},
    // );
    // console.log(EMAIL_TEMPLATE);
    const sendGridOptions = {
      personalizations: [
        {
          from: {
            email: EMAIL_SENDER,
          },
          to: [
            {
              email: customer.email,
              // name: customer.username,
            },
          ],
          // subject: '[eDrops] Email Verification',
          dynamic_template_data:{
            firstName: customer.firstName,
            lastName: customer.lastName,
            text: "Thanks for registering to use eDrops. Please verify your email by clicking on the following link:",
            verifyLink: `${baseURL}/api/customers/verify?customerId=${customer.id}&token=${verificationTokenHash}`,
          }
        },
      ],
      template_id: "d-0fdd579fca2e4125a687db6e13be290d",
      from: {
        email: EMAIL_SENDER,
      },
      reply_to: {
        email: EMAIL_SENDER,
      },
    };

    this.sendGrid.send(
      process.env.APP_EMAIL_API_KEY as string,
      sendGridOptions,
    );
  }

  async verifyEmail(
    customerId: string,
    verificationToken: string,
  ): Promise<Customer> {
    const customer = await this.findById(customerId);
    if (!customer) {
      throw new HttpErrors.NotFound('Customer not found');
    }
    const currentTime = new Date();
    return await this.updateById(customerId, {
      emailVerified:
        customer?.verificationToken === verificationToken &&
        (customer?.verificationTokenExpires ?? currentTime) > currentTime,
    }).then(
      async() => { 
        // Update associated User instance
        const userRepository = await this.userRepositoryGetter();
        await userRepository.updateById(customerId, {
          emailVerified:
            customer?.verificationToken === verificationToken &&
            (customer?.verificationTokenExpires ?? currentTime) > currentTime,
        });
        return this.findById(customerId)
      }
    ).catch(err => {
      throw new HttpErrors.InternalServerError(err.message);
    });
  }

  async getCustomerCart(
    customerId: string,
  ): Promise<Partial<OrderInfo> | number | Error> {
    return this.orderInfos(customerId)
      .find({where: {orderComplete: false}})
      .then(orders => {
        if (orders.length > 1) {
          log.error(
            `Error getting customer cart or there's more than one active cart`,
          );
          throw new HttpErrors.NotFound(
            'Error while querying for customer cart',
          );
        } else if (orders.length === 0) {
          log.warning(
            `No cart found for customer id=${customerId}, need to create one`,
          );
          return 0;
        }
        log.info(
          `Cart already exists, is order info model with id ${orders[0].id}`,
        );
        return {
          id: orders[0].id,
          checkoutIdClient: orders[0].checkoutIdClient,
          checkoutLink: orders[0].checkoutLink,
        };
      })
      .catch(err => {
        log.error(
          `Error getting customer cart or there's more than one active cart: ${err}`,
        );
        return new Error('Error while querying for customer cart');
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

    const fileInfos: Partial<FileInfo> = files.map(
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
    return {fileInfo, fields};
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

    const fileInfos: Partial<FileInfo> = files.map(
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
    return {fileInfo, fields};
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

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await hash(newPassword, await genSalt());
    await this.updateById(userId, {password: hashedPassword});

    const userRepository = await this.userRepositoryGetter();
    await userRepository.updateById(userId, {password: hashedPassword});
  }
}
