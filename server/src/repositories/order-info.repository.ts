import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {OrderInfo, OrderInfoRelations} from '../models';

export class OrderInfoRepository extends DefaultCrudRepository<
  OrderInfo,
  typeof OrderInfo.prototype.id,
  OrderInfoRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(OrderInfo, dataSource);
  }
}
