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
} from '@loopback/rest';
import {OrderProduct} from '../models';
import {OrderProductRepository} from '../repositories';

export class OrderProductController {
  constructor(
    @repository(OrderProductRepository)
    public orderProductRepository : OrderProductRepository,
  ) {}

  @post('/order-products')
  @response(200, {
    description: 'OrderProduct model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrderProduct)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderProduct, {
            title: 'NewOrderProduct',
            exclude: ['id'],
          }),
        },
      },
    })
    orderProduct: Omit<OrderProduct, 'id'>,
  ): Promise<OrderProduct> {
    return this.orderProductRepository.create(orderProduct);
  }

  @get('/order-products/count')
  @response(200, {
    description: 'OrderProduct model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(OrderProduct) where?: Where<OrderProduct>,
  ): Promise<Count> {
    return this.orderProductRepository.count(where);
  }

  @get('/order-products')
  @response(200, {
    description: 'Array of OrderProduct model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(OrderProduct, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(OrderProduct) filter?: Filter<OrderProduct>,
  ): Promise<OrderProduct[]> {
    return this.orderProductRepository.find(filter);
  }

  @patch('/order-products')
  @response(200, {
    description: 'OrderProduct PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderProduct, {partial: true}),
        },
      },
    })
    orderProduct: OrderProduct,
    @param.where(OrderProduct) where?: Where<OrderProduct>,
  ): Promise<Count> {
    return this.orderProductRepository.updateAll(orderProduct, where);
  }

  @get('/order-products/{id}')
  @response(200, {
    description: 'OrderProduct model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(OrderProduct, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(OrderProduct, {exclude: 'where'}) filter?: FilterExcludingWhere<OrderProduct>
  ): Promise<OrderProduct> {
    return this.orderProductRepository.findById(id, filter);
  }

  @patch('/order-products/{id}')
  @response(204, {
    description: 'OrderProduct PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderProduct, {partial: true}),
        },
      },
    })
    orderProduct: OrderProduct,
  ): Promise<void> {
    await this.orderProductRepository.updateById(id, orderProduct);
  }

  @put('/order-products/{id}')
  @response(204, {
    description: 'OrderProduct PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() orderProduct: OrderProduct,
  ): Promise<void> {
    await this.orderProductRepository.replaceById(id, orderProduct);
  }

  @del('/order-products/{id}')
  @response(204, {
    description: 'OrderProduct DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.orderProductRepository.deleteById(id);
  }
}
