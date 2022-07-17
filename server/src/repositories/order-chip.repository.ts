import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {OrderChip, OrderChipRelations} from '../models';

export class OrderChipRepository extends DefaultCrudRepository<
  OrderChip,
  typeof OrderChip.prototype.id,
  OrderChipRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(OrderChip, dataSource);
  }
}
