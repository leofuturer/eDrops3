import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MysqlDsDataSource } from '../datasources';
import { Scope, ScopeRelations } from '../models';

export class ScopeRepository extends DefaultCrudRepository<
  Scope,
  typeof Scope.prototype.id,
  ScopeRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(Scope, dataSource);
  }
}
