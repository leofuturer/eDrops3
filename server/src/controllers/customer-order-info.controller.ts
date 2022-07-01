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
  Customer,
  OrderInfo,
} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerOrderInfoController {
  constructor(
    @repository(CustomerRepository) protected customerRepository: CustomerRepository,
  ) { }

  @get('/customers/{id}/orderInfos', {
    responses: {
      '200': {
        description: 'Array of Customer has many OrderInfo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OrderInfo)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<OrderInfo>,
  ): Promise<OrderInfo[]> {
    return this.customerRepository.orderInfos(id).find(filter);
  }

  @post('/customers/{id}/orderInfos', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: {'application/json': {schema: getModelSchemaRef(OrderInfo)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Customer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderInfo, {
            title: 'NewOrderInfoInCustomer',
            exclude: ['id'],
            optional: ['customerId']
          }),
        },
      },
    }) orderInfo: Omit<OrderInfo, 'id'>,
  ): Promise<OrderInfo> {
    return this.customerRepository.orderInfos(id).create(orderInfo);
  }

  @patch('/customers/{id}/orderInfos', {
    responses: {
      '200': {
        description: 'Customer.OrderInfo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderInfo, {partial: true}),
        },
      },
    })
    orderInfo: Partial<OrderInfo>,
    @param.query.object('where', getWhereSchemaFor(OrderInfo)) where?: Where<OrderInfo>,
  ): Promise<Count> {
    return this.customerRepository.orderInfos(id).patch(orderInfo, where);
  }

  @del('/customers/{id}/orderInfos', {
    responses: {
      '200': {
        description: 'Customer.OrderInfo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(OrderInfo)) where?: Where<OrderInfo>,
  ): Promise<Count> {
    return this.customerRepository.orderInfos(id).delete(where);
  }
}
