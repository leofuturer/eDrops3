import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MysqlDsDataSource } from '../datasources';
import { OrderItemBase, OrderItemBaseRelations } from '../models';

export class OrderItemBaseRepository extends DefaultCrudRepository<
  OrderItemBase,
  typeof OrderItemBase.prototype.id,
  OrderItemBaseRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(OrderItemBase, dataSource);
  }
}
