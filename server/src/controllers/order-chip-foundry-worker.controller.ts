import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  OrderChip,
  FoundryWorker,
} from '../models';
import {OrderChipRepository} from '../repositories';

export class OrderChipFoundryWorkerController {
  constructor(
    @repository(OrderChipRepository)
    public orderChipRepository: OrderChipRepository,
  ) { }

  @get('/order-chips/{id}/foundry-worker', {
    responses: {
      '200': {
        description: 'FoundryWorker belonging to OrderChip',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FoundryWorker)},
          },
        },
      },
    },
  })
  async getFoundryWorker(
    @param.path.number('id') id: typeof OrderChip.prototype.id,
  ): Promise<FoundryWorker> {
    return this.orderChipRepository.worker(id);
  }
}
