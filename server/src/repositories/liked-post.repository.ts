import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {LikedPost, LikedPostRelations} from '../models';

export class LikedPostRepository extends DefaultCrudRepository<
  LikedPost,
  typeof LikedPost.prototype.id,
  LikedPostRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(LikedPost, dataSource);
  }
}
