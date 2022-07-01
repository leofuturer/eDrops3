import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {Customer, CustomerRelations, CustomerAddress, FileInfo, OrderInfo} from '../models';
import {CustomerAddressRepository} from './customer-address.repository';
import {FileInfoRepository} from './file-info.repository';
import {OrderInfoRepository} from './order-info.repository';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {

  public readonly customerAddresses: HasManyRepositoryFactory<CustomerAddress, typeof Customer.prototype.id>;

  public readonly fileInfos: HasManyRepositoryFactory<FileInfo, typeof Customer.prototype.id>;

  public readonly orderInfos: HasManyRepositoryFactory<OrderInfo, typeof Customer.prototype.id>;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource, @repository.getter('CustomerAddressRepository') protected customerAddressRepositoryGetter: Getter<CustomerAddressRepository>, @repository.getter('FileInfoRepository') protected fileInfoRepositoryGetter: Getter<FileInfoRepository>, @repository.getter('OrderInfoRepository') protected orderInfoRepositoryGetter: Getter<OrderInfoRepository>,
  ) {
    super(Customer, dataSource);
    this.orderInfos = this.createHasManyRepositoryFactoryFor('orderInfos', orderInfoRepositoryGetter,);
    this.registerInclusionResolver('orderInfos', this.orderInfos.inclusionResolver);
    this.fileInfos = this.createHasManyRepositoryFactoryFor('fileInfos', fileInfoRepositoryGetter,);
    this.registerInclusionResolver('fileInfos', this.fileInfos.inclusionResolver);
    this.customerAddresses = this.createHasManyRepositoryFactoryFor('customerAddresses', customerAddressRepositoryGetter,);
    this.registerInclusionResolver('customerAddresses', this.customerAddresses.inclusionResolver);
  }
}
