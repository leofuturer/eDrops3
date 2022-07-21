import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {UserProfile, UserProfileRelations} from '../models';

export class UserProfileRepository extends DefaultCrudRepository<
  UserProfile,
  typeof UserProfile.prototype.id,
  UserProfileRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(UserProfile, dataSource);
  }
}
