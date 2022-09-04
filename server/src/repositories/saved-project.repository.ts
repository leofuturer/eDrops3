import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {SavedProject, SavedProjectRelations} from '../models';

export class SavedProjectRepository extends DefaultCrudRepository<
  SavedProject,
  typeof SavedProject.prototype.id,
  SavedProjectRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(SavedProject, dataSource);
  }
}
