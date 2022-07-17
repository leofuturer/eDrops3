import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {CustomerAddress, CustomerAddressRelations} from '../models';

export class CustomerAddressRepository extends DefaultCrudRepository<
  CustomerAddress,
  typeof CustomerAddress.prototype.id,
  CustomerAddressRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(CustomerAddress, dataSource);
  }
}
