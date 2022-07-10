import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {OrderChip, OrderChipRelations, FileInfo, FoundryWorker} from '../models';
import {FileInfoRepository} from './file-info.repository';
import {FoundryWorkerRepository} from './foundry-worker.repository';

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
