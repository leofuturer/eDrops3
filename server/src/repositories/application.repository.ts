import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {Application, ApplicationRelations} from '../models';

export class ApplicationRepository extends DefaultCrudRepository<
  Application,
  typeof Application.prototype.id,
  ApplicationRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(Application, dataSource);
  }
}
