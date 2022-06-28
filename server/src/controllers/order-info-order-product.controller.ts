import { inject } from '@loopback/core';
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
  Request,
  RestBindings
} from '@loopback/rest';
import {
  OrderInfo,
  OrderProduct,
} from '../models';
import {OrderInfoRepository} from '../repositories';
import { CustomRequest } from './order-info.controller';

export class OrderInfoOrderProductController {
  constructor(
    @repository(OrderInfoRepository) protected orderInfoRepository: OrderInfoRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request,
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
  ): Promise<void> {
    return this.orderInfoRepository.addOrderChipToCart(orderProduct, this.request as CustomRequest);
  }
}
