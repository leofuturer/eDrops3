import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {SavedPost, SavedPostRelations} from '../models';

export class SavedPostRepository extends DefaultCrudRepository<
  SavedPost,
  typeof SavedPost.prototype.id,
  SavedPostRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(SavedPost, dataSource);
  }
}
