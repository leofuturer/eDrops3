import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MysqlDsDataSource } from '../datasources';
import { Project, ProjectRelations } from '../models';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(Project, dataSource);
  }
}
