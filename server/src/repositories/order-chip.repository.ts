import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
import { MysqlDsDataSource } from '../datasources';
import { FileInfo, FoundryWorker, OrderChip, OrderChipRelations } from '../models';
import { FileInfoRepository } from './file-info.repository';
import { FoundryWorkerRepository } from './foundry-worker.repository';

export class OrderChipRepository extends DefaultCrudRepository<
  OrderChip,
  typeof OrderChip.prototype.id,
  OrderChipRelations
> {

  public readonly fileInfo: BelongsToAccessor<FileInfo, typeof OrderChip.prototype.id>;

  public readonly worker: BelongsToAccessor<FoundryWorker, typeof OrderChip.prototype.id>;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource, @repository.getter('FileInfoRepository') protected fileInfoRepositoryGetter: Getter<FileInfoRepository>, @repository.getter('FoundryWorkerRepository') protected foundryWorkerRepositoryGetter: Getter<FoundryWorkerRepository>,
  ) {
    super(OrderChip, dataSource);
    this.worker = this.createBelongsToAccessorFor('worker', foundryWorkerRepositoryGetter,);
    this.registerInclusionResolver('worker', this.worker.inclusionResolver);
    this.fileInfo = this.createBelongsToAccessorFor('fileInfo', fileInfoRepositoryGetter,);
    this.registerInclusionResolver('fileInfo', this.fileInfo.inclusionResolver);
  }
}
