import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {OrderMessage, OrderMessageRelations} from '../models';

export class OrderMessageRepository extends DefaultCrudRepository<
  OrderMessage,
  typeof OrderMessage.prototype.id,
  OrderMessageRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(OrderMessage, dataSource);
  }
}
