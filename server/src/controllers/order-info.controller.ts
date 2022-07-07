import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  RestBindings,
  Request,
} from '@loopback/rest';
import {IncomingHttpHeaders} from 'http';
import path from 'path';
import {OrderInfo} from '../models';
import {OrderInfoRepository} from '../repositories';

export interface CustomRequest extends Request {
  'headers': {
    'x-shopify-hmac-sha256': string;
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
  @post('/orderInfos/newOrderCreated')
  @response(200, {
    description: 'OrderInfo model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrderInfo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderInfo, {
            title: 'NewOrderInfo',
            exclude: ['id'],
          }),
        },
      },
    })
    orderInfo: Omit<OrderInfo, 'id'>,
  ): Promise<void> {
    return this.orderInfoRepository.newOrderCreated(
      orderInfo,
      this.request as CustomRequest,
    );
  }

  

  @get('/orderInfos/{id}')
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

  @get('/orderInfos')
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
    return this.orderInfoRepository.find(filter);
  }
}
