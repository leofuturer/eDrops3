import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {
  OrderInfo,
  OrderChip,
} from '../models';
import {OrderInfoRepository} from '../repositories';

export class OrderInfoOrderChipController {
  constructor(
    @repository(OrderInfoRepository) protected orderInfoRepository: OrderInfoRepository,
  ) { }

  @get('/orderInfos/{id}/orderChips', {
    responses: {
      '200': {
        description: 'Array of OrderInfo has many OrderChip',
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
    return this.orderInfoRepository.orderChips(id).find(filter);
  }

  @post('/orderInfos/{id}/addOrderChipToCart', {
    responses: {
      '200': {
        description: 'OrderInfo model instance',
        content: {'application/json': {schema: getModelSchemaRef(OrderChip)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof OrderInfo.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderChip, {
            title: 'NewOrderChipInOrderInfo',
            exclude: ['id'],
            optional: ['orderId']
          }),
        },
      },
    }) orderChip: Omit<OrderChip, 'id'>,
  ): Promise<OrderChip> {
    return this.orderInfoRepository.orderChips(id).create(orderChip);
  }
}
