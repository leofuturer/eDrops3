import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
  BelongsToAccessor,
} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {
  Customer,
  CustomerRelations,
  CustomerAddress,
  FileInfo,
  OrderInfo,
  User,
} from '../models';
import {CustomerAddressRepository} from './customer-address.repository';
import {FileInfoRepository} from './file-info.repository';
import {OrderInfoRepository} from './order-info.repository';
import {UserRepository} from './user.repository';
import {genSalt, hash} from 'bcryptjs';
import {createHash} from 'crypto';
import SendGrid from '../services/send-grid.service';
import {verifyHTML} from '../lib/views/verify';
import ejs from 'ejs';
import {
  EMAIL_HOSTNAME,
  EMAIL_PORT,
  EMAIL_SENDER,
} from '../lib/constants/emailConstants';
import { exit } from 'process';

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
  }

  async createCustomer(
    customer: Omit<Customer & User, 'id'>,
  ): Promise<Customer> {
    const hashedPassword = await hash(customer.password, await genSalt());
    const userData = {
      realm: customer.realm,
      username: customer.username,
      password: hashedPassword,
      userType: 'customer',
      email: customer.email,
      emailVerified: customer.emailVerified,
      verificationToken: customer.verificationToken,
    };
    const userRepository = await this.userRepositoryGetter();
    const userInstance = await userRepository.create(userData);
    const customerData = {
      ...userInstance,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phoneNumber: customer.phoneNumber,
      customerType: customer.customerType,
      // userId: userInstance.id,
    };
    const customerInstance = await this.create(customerData);
    return customerInstance;
  }

  async createVerificationToken(customerId: string): Promise<string> {
    const verificationTokenHash = createHash('sha256')
      .update(customerId + Date.now().toString())
      .digest('hex');
    return this.updateById(customerId, {
      verificationToken: verificationTokenHash,
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
      process.env.NODE_ENV == 'production'
        ? `https://${EMAIL_HOSTNAME}`
        : `http://${EMAIL_HOSTNAME}:${EMAIL_PORT}`;

    const EMAIL_TEMPLATE = ejs.render(
      verifyHTML,
      {
        text: `Hello ${customer.username}! Thanks for registering to use eDrops. Please verify your email by clicking on the following link:`,
        email: EMAIL_SENDER,
        verifyHref:
          baseURL +
          `/api/customer/verify?customerId=${customer.id}&token=${verificationTokenHash}`,
      },
      {},
    );
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
              name: customer.username,
            },
          ],
          subject: '[eDrops] Email Verification',
        },
      ],
      from: {
        email: EMAIL_SENDER,
      },
      reply_to: {
        email: EMAIL_SENDER,
      },
      content: [
        {
          type: 'text/html',
          value: EMAIL_TEMPLATE,
        },
      ],
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
    const customer = await this.findOne({
      where: {
        id: customerId,
      },
    });
    if (customer?.verificationToken === verificationToken) {
      this.updateById(customerId, {
        emailVerified: true,
      });
    }
    return customer as Customer;
  }
}
