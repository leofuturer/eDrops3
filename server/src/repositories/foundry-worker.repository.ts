import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {FoundryWorker, FoundryWorkerRelations, OrderChip} from '../models';
import {OrderChipRepository} from './order-chip.repository';

export class FoundryWorkerRepository extends DefaultCrudRepository<
  FoundryWorker,
  typeof FoundryWorker.prototype.id,
  FoundryWorkerRelations
> {

  public readonly orderChips: HasManyRepositoryFactory<OrderChip, typeof FoundryWorker.prototype.id>;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource, @repository.getter('OrderChipRepository') protected orderChipRepositoryGetter: Getter<OrderChipRepository>,
  ) {
    super(FoundryWorker, dataSource);
    this.orderChips = this.createHasManyRepositoryFactoryFor('orderChips', orderChipRepositoryGetter,);
    this.registerInclusionResolver('orderChips', this.orderChips.inclusionResolver);
  }
}
