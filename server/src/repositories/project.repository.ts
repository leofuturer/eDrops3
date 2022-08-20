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

  async getFeaturedProjects() : Promise<Project[]> {
    return this.find({
      where: {
        datetime: {
          gte: new Date(Date.now() - (1000 * 60 * 60 * 24 * 7)),
        },
      },
      order: ['likes DESC'],
      limit: 4,
    })
  }
}
