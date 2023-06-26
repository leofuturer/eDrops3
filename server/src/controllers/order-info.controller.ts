import { inject } from '@loopback/core';
import {
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param, post, Request, requestBody,
  response,
  RestBindings
} from '@loopback/rest';
import { OrderInfo } from '../models';
import { OrderInfoRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

export interface CustomRequest extends Request {
  'headers': {
    'X-Shopify-Hmac-Sha256': string;
    'x-edrop-userbase': string;
  },
  'accessToken': {
    'userId': string;
  }
}

export class OrderInfoController {
  constructor(
    @repository(OrderInfoRepository)
    public orderInfoRepository: OrderInfoRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request,
  ) {}

  // Shopify webhook (not for end users)
  @post('/orders/order-completed')
  @response(200, {
    description: 'OrderInfo model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrderInfo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
          }
          // schema: getModelSchemaRef(OrderInfo, {
          //   title: 'NewOrderInfo',
          //   exclude: ['id'],
          //   partial: true,
          // }),
        },
      },
    })
    orderInfo: object,
  ): Promise<void> {
    return this.orderInfoRepository.newOrderCreated(
      orderInfo,
      this.request as CustomRequest,
    );
  }

  @authenticate('jwt')
  @get('/orders/{id}')
  @response(200, {
    description: 'OrderInfo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(OrderInfo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(OrderInfo, {exclude: 'where'})
    filter?: FilterExcludingWhere<OrderInfo>,
  ): Promise<OrderInfo> {
    return this.orderInfoRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @get('/orders')
  @response(200, {
    description: 'Array of OrderInfo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(OrderInfo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(OrderInfo) filter?: Filter<OrderInfo>,
  ): Promise<OrderInfo[]> {
    return this.orderInfoRepository.find();
  }
}
