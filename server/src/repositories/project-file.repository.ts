import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {ProjectFile, ProjectFileRelations} from '../models';

export class ProjectFileRepository extends DefaultCrudRepository<
  ProjectFile,
  typeof ProjectFile.prototype.id,
  ProjectFileRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(ProjectFile, dataSource);
  }
}
