import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {ProjectCommentLink, ProjectCommentLinkRelations} from '../models';

export class ProjectCommentLinkRepository extends DefaultCrudRepository<
  ProjectCommentLink,
  typeof ProjectCommentLink.prototype.id,
  ProjectCommentLinkRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(ProjectCommentLink, dataSource);
  }
}
