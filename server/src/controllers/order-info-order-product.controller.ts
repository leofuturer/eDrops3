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
  OrderInfo,
  OrderProduct,
} from '../models';
import {OrderInfoRepository} from '../repositories';

export class OrderInfoOrderProductController {
  constructor(
    @repository(OrderInfoRepository) protected orderInfoRepository: OrderInfoRepository,
  ) { }

  @get('/orderInfos/{id}/orderProducts', {
    responses: {
      '200': {
        description: 'Array of OrderInfo has many OrderProduct',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OrderProduct)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<OrderProduct>,
  ): Promise<OrderProduct[]> {
    return this.orderInfoRepository.orderProducts(id).find(filter);
  }

  @post('/orderInfos/{id}/addOrderProductToCart', {
    responses: {
      '200': {
        description: 'OrderInfo model instance',
        content: {'application/json': {schema: getModelSchemaRef(OrderProduct)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof OrderInfo.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderProduct, {
            title: 'NewOrderProductInOrderInfo',
            exclude: ['id'],
            optional: ['orderId']
          }),
        },
      },
    }) orderProduct: Omit<OrderProduct, 'id'>,
  ): Promise<OrderProduct> {
    return this.orderInfoRepository.addOrderChipToCart(id, orderProduct);
  }
}
