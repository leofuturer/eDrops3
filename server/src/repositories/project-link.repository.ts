import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {ProjectLink, ProjectLinkRelations} from '../models';

export class ProjectLinkRepository extends DefaultCrudRepository<
  ProjectLink,
  typeof ProjectLink.prototype.id,
  ProjectLinkRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(ProjectLink, dataSource);
  }
}
