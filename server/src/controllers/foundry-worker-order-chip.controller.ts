import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  FoundryWorker,
  OrderChip,
} from '../models';
import {FoundryWorkerRepository} from '../repositories';

export class FoundryWorkerOrderChipController {
  constructor(
    @repository(FoundryWorkerRepository) protected foundryWorkerRepository: FoundryWorkerRepository,
  ) { }

  @get('/foundryWorkers/{id}/orderChips', {
    responses: {
      '200': {
        description: 'Array of FoundryWorker has many OrderChip',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OrderChip)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<OrderChip>,
  ): Promise<OrderChip[]> {
    return this.foundryWorkerRepository.orderChips(id).find(filter);
  }
}
