import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {FoundryWorker, FoundryWorkerRelations} from '../models';

export class FoundryWorkerRepository extends DefaultCrudRepository<
  FoundryWorker,
  typeof FoundryWorker.prototype.id,
  FoundryWorkerRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(FoundryWorker, dataSource);
  }
}
