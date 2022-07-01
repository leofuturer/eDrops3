import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {Customer, CustomerRelations, CustomerAddress, FileInfo, OrderInfo, User} from '../models';
import {CustomerAddressRepository} from './customer-address.repository';
import {FileInfoRepository} from './file-info.repository';
import {OrderInfoRepository} from './order-info.repository';
import {UserRepository} from './user.repository';
import {genSalt, hash} from 'bcryptjs';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {

  public readonly customerAddresses: HasManyRepositoryFactory<CustomerAddress, typeof Customer.prototype.id>;

  public readonly fileInfos: HasManyRepositoryFactory<FileInfo, typeof Customer.prototype.id>;

  public readonly orderInfos: HasManyRepositoryFactory<OrderInfo, typeof Customer.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Customer.prototype.id>;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource, @repository.getter('CustomerAddressRepository') protected customerAddressRepositoryGetter: Getter<CustomerAddressRepository>, @repository.getter('FileInfoRepository') protected fileInfoRepositoryGetter: Getter<FileInfoRepository>, @repository.getter('OrderInfoRepository') protected orderInfoRepositoryGetter: Getter<OrderInfoRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Customer, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.orderInfos = this.createHasManyRepositoryFactoryFor('orderInfos', orderInfoRepositoryGetter,);
    this.registerInclusionResolver('orderInfos', this.orderInfos.inclusionResolver);
    this.fileInfos = this.createHasManyRepositoryFactoryFor('fileInfos', fileInfoRepositoryGetter,);
    this.registerInclusionResolver('fileInfos', this.fileInfos.inclusionResolver);
    this.customerAddresses = this.createHasManyRepositoryFactoryFor('customerAddresses', customerAddressRepositoryGetter,);
    this.registerInclusionResolver('customerAddresses', this.customerAddresses.inclusionResolver);
  }

  async createCustomer(
    customer: Customer & User
  ) : Promise<Customer> {
    const hashedPassword = await hash(customer.password, await genSalt())
    const userData = {
      realm: customer.realm,
      username: customer.username,
      password: hashedPassword,
      userType: customer.userType,
      email: customer.email,
      emailVerified: customer.emailVerified,
      verificationToken: customer.verificationToken,
    }
    const userRepository = await this.userRepositoryGetter();
    const userInstance = await userRepository.create(userData);
    const customerData = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      phoneNumber: customer.phoneNumber,
      customerType: customer.customerType,
      userId: userInstance.id,
    }
    const customerInstance = await this.create(customerData);
    return customerInstance;
  }
}