import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {LikedProject, LikedProjectRelations} from '../models';

export class LikedProjectRepository extends DefaultCrudRepository<
  LikedProject,
  typeof LikedProject.prototype.id,
  LikedProjectRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(LikedProject, dataSource);
  }
}
