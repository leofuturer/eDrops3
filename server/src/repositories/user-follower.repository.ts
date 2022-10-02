import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {UserFollower, UserFollowerRelations} from '../models';

export class UserFollowerRepository extends DefaultCrudRepository<
  UserFollower,
  typeof UserFollower.prototype.id,
  UserFollowerRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(UserFollower, dataSource);
  }
}
