import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {UserBase, UserBaseRelations} from '../models';

export class UserBaseRepository extends DefaultCrudRepository<
  UserBase,
  typeof UserBase.prototype.id,
  UserBaseRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(UserBase, dataSource);
  }
}
