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

  @get('/foundry-workers/{id}/order-chips', {
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

  @post('/foundry-workers/{id}/order-chips', {
    responses: {
      '200': {
        description: 'FoundryWorker model instance',
        content: {'application/json': {schema: getModelSchemaRef(OrderChip)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof FoundryWorker.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderChip, {
            title: 'NewOrderChipInFoundryWorker',
            exclude: ['id'],
            optional: ['workerId']
          }),
        },
      },
    }) orderChip: Omit<OrderChip, 'id'>,
  ): Promise<OrderChip> {
    return this.foundryWorkerRepository.orderChips(id).create(orderChip);
  }

  @patch('/foundry-workers/{id}/order-chips', {
    responses: {
      '200': {
        description: 'FoundryWorker.OrderChip PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderChip, {partial: true}),
        },
      },
    })
    orderChip: Partial<OrderChip>,
    @param.query.object('where', getWhereSchemaFor(OrderChip)) where?: Where<OrderChip>,
  ): Promise<Count> {
    return this.foundryWorkerRepository.orderChips(id).patch(orderChip, where);
  }

  @del('/foundry-workers/{id}/order-chips', {
    responses: {
      '200': {
        description: 'FoundryWorker.OrderChip DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(OrderChip)) where?: Where<OrderChip>,
  ): Promise<Count> {
    return this.foundryWorkerRepository.orderChips(id).delete(where);
  }
}
