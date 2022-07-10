import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MysqlDsDataSource } from '../datasources';
import { ACL, AclRelations } from '../models';

export class AclRepository extends DefaultCrudRepository<
  ACL,
  typeof ACL.prototype.id,
  AclRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(ACL, dataSource);
  }
}
