import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MysqlDsDataSource } from '../datasources';
import { FileInfo, FileInfoRelations } from '../models';

export class FileInfoRepository extends DefaultCrudRepository<
  FileInfo,
  typeof FileInfo.prototype.id,
  FileInfoRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(FileInfo, dataSource);
  }
}
