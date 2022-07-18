import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MysqlDsDataSource } from '../datasources';
import { Forum, ForumRelations } from '../models';

export class ForumRepository extends DefaultCrudRepository<
  Forum,
  typeof Forum.prototype.id,
  ForumRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(Forum, dataSource);
  }
}
