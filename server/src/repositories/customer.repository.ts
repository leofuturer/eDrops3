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
import path from 'path';
import ShopifyBuy, { buildClient, MailingAddressInput } from 'shopify-buy';
import { MysqlDsDataSource } from '../datasources';
import { calculate } from '../lib/toolbox/calculate';
import log from '../lib/toolbox/log';
import { DTO } from '../lib/types/model';
import {
  Address,
  Customer,
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

  public readonly shopify: ShopifyBuy;

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

    this.shopify = buildClient({
      storefrontAccessToken: process.env.SHOPIFY_TOKEN as string,
      domain: process.env.SHOPIFY_DOMAIN as string,
      apiVersion: '2023-04'
    });
  }

  /**
   * Create a new customer and its associated user instance
   * @param customer      Customer to be created
   * @param createAddress Whether to create a default address for the customer (mainly used for initial seeding)
   * @returns             Created customer instance
   */
  async createCustomer(
    customer: DTO<Customer & User & Partial<Omit<Address, 'id'>>>,
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
    if (customer.country && customer.state && customer.city && customer.street && customer.zipCode) {
      const addressData: DTO<Address> = {
        street: customer.street,
        ...(customer.streetLine2 && { streetLine2: customer.streetLine2 }),
        country: customer.country,
        state: customer.state,
        city: customer.city,
        zipCode: customer.zipCode,
        isDefault: customer.isDefault || true,
      };
      log.info('Customer instance created, now associating address with it');
      this.addresses(customerInstance.id)
        .create(addressData)
        .catch(err => {
          // roll back the customer creation
          this.deleteById(customerInstance?.id);
          userRepository.deleteById(userInstance?.id);
          throw new HttpErrors.InternalServerError(err.message);
        });
    }
    await userRepository.sendVerificationEmail(userInstance);
    return customerInstance;
  }

  async deleteCustomer(id: typeof Customer.prototype.id) {
    const userRepository = await this.userRepositoryGetter();
    await userRepository.deleteById(id);
    // May need to delete associated addresses and order infos?
    await this.deleteById(id);
  }

  async setDefaultAddress(id: typeof Customer.prototype.id, addressId: typeof Address.prototype.id): Promise<Address> {
    const defaultAddresses = await this.addresses(id).find({
      where: { isDefault: true }
    });
    if (defaultAddresses.length > 0) {
      // Remove default from all other addresses
      await Promise.all(defaultAddresses.map(async (d) => {
        d.isDefault = false;
        return this.addresses(id).patch(d, { id: d.id });
      }));
    }
    const addressToChange = await this.addresses(id).find({ where: { id: addressId } }).then(addresses => addresses[0]);
    addressToChange.isDefault = true;
    await this.addresses(id).patch(addressToChange, { id: addressToChange.id });
    return addressToChange;
  }

  // DO NOT USE FROM CONTROLLER
  // Only used to create cart when getCart cannot find any active cart
  async createCart(id: typeof Customer.prototype.id): Promise<OrderInfo> {
    // Double check if customer already has an active order
    const allOrders = await this.orderInfos(id).find({ where: { orderComplete: false } });
    if (allOrders.length !== 0) {
      throw new HttpErrors.BadRequest('Customer already has an active order');
    }
    // Create a new order with Shopify then save it to our database
    return this.shopify.checkout.create().then((res) => {
      // console.log(res);
      const lastSlash = res.webUrl.lastIndexOf('/');
      const lastQuestionMark = res.webUrl.lastIndexOf('?');
      const data: Partial<OrderInfo> = {
        checkoutIdClient: res.id as string,
        checkoutToken: res.webUrl.slice(lastSlash + 1, lastQuestionMark),
        checkoutLink: res.webUrl,
        createdAt: res.createdAt,
        lastModifiedAt: res.updatedAt,
        orderComplete: false,
        status: 'Order in progress',
        customerId: id,
        shippingAddressId: 0, // 0 to indicate no address selected yet (pk cannot be 0)
        billingAddressId: 0,
      };
      return data;
    }).then((data: Partial<OrderInfo>) => {
      return this.orderInfos(id).create(data);
    });
  }

  // We want to only use getCart to get the cart 
  // and create a new cart if necessary
  // This is so we don't create race conditions
  // that lead to multiple carts being created
  async getCart(customerId: string): Promise<OrderInfo> {
    // Check if there is an active cart
    return this.orderInfos(customerId)
      .find({ where: { orderComplete: false }, include: ['orderProducts', 'orderChips'] })
      .then(orders => {
        // If there is multiple active carts, consolidate them and return the first one
        if (orders.length > 1) {
          const primaryOrder = orders[0];
          const otherOrders = orders.slice(1);
          let allOrderProducts = primaryOrder.orderProducts ?? [];
          let allOrderChips = primaryOrder.orderChips ?? [];
          otherOrders.forEach(order => {
            allOrderProducts = allOrderProducts.concat(order.orderProducts ?? []);
            allOrderChips = allOrderChips.concat(order.orderChips ?? []);
            this.orderInfos(customerId).delete({ id: order.id });
            // Could potentially remove line items from other orders here
            // But not necessary as order will just be abandoned
          });
          primaryOrder.orderProducts = allOrderProducts;
          primaryOrder.orderChips = allOrderChips;
          this.orderInfos(customerId).patch(primaryOrder, { id: primaryOrder.id });
          return primaryOrder;
        }
        // If no active cart found, create one and return the new one
        else if (orders.length === 0) {
          return this.createCart(customerId);
        }
        // Otherwise, return the active cart
        log.info(`Cart already exists, is order info model with id ${orders[0].id}`);
        return orders[0];
      })
      .catch(err => { throw err; });
  }

  async checkoutCart(id: typeof Customer.prototype.id, orderId: typeof OrderInfo.prototype.id, address?: DTO<Address>): Promise<OrderInfo> {
    const orderInfos = await this.orderInfos(id).find({ where: { id: orderId, orderComplete: false } });
    if (orderInfos.length === 0) {
      throw new HttpErrors.NotFound('No cart found');
    }
    const cart = orderInfos[0];

    const user = await this.user(id);
    const customer = await this.findById(id);
    await this.shopify.checkout.updateEmail(cart.checkoutIdClient, user.email)
      .then((res) => {
        if (address) {
          const shippingAddr: MailingAddressInput = {
            address1: address.street,
            address2: address.streetLine2,
            city: address.city,
            province: address.state,
            country: address.country,
            zip: address.zipCode,
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phoneNumber,
          };
          return this.shopify.checkout.updateShippingAddress(cart.checkoutIdClient, shippingAddr)
        }
        return res;
      });
    return cart;
  }

  async uploadFile(request: Request, response: Response, id: typeof Customer.prototype.id): Promise<FileInfo> {
    const username = await this.user(id).then(user => user.username);
    return process.env.NODE_ENV !== 'production'
      ? await this.uploadDisk(
        request,
        response,
        username,
        id as string,
      )
      : await this.uploadS3(
        request,
        response,
        username,
        id as string,
      )
  }

  async uploadDisk(
    request: Request,
    response: Response,
    username: string,
    id: string,
  ): Promise<FileInfo> {
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

    // const fields = request.body;
    const fileInfo = await this.fileInfos(id).create(fileInfos[0]);
    // return {files, fields};
    return fileInfo;
  }

  async uploadS3(
    request: Request,
    response: Response,
    username: string,
    id: string,
  ): Promise<FileInfo> {
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
    return fileInfo;
  }

  async downloadById(userId: typeof Customer.prototype.id, fileId: typeof FileInfo.prototype.id, response: Response): Promise<Response> {
    const file = await this.fileInfos(userId).find({ where: { id: fileId } });
    if (!file[0]) {
      throw new HttpErrors.NotFound('File not found');
    }
    return process.env.NODE_ENV !== 'production' ?
      this.downloadDisk(file[0].containerFileName, response) :
      this.downloadS3(file[0].containerFileName, response);
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
