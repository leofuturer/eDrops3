import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {PostCommentLink, PostCommentLinkRelations} from '../models';

export class PostCommentLinkRepository extends DefaultCrudRepository<
  PostCommentLink,
  typeof PostCommentLink.prototype.id,
  PostCommentLinkRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(PostCommentLink, dataSource);
  }
}
