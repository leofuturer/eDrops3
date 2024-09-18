import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {CommentLink, CommentLinkRelations} from '../models';

export class CommentLinkRepository extends DefaultCrudRepository<
  CommentLink,
  typeof CommentLink.prototype.id,
  CommentLinkRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(CommentLink, dataSource);
  }
}
