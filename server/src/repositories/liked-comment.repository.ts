import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {LikedComment, LikedCommentRelations} from '../models';

export class LikedCommentRepository extends DefaultCrudRepository<
  LikedComment,
  typeof LikedComment.prototype.id,
  LikedCommentRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(LikedComment, dataSource);
  }
}
