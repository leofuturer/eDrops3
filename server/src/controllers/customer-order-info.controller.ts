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
  response,
} from '@loopback/rest';
import {Customer, OrderChip, OrderInfo} from '../models';
import {CustomerRepository, OrderInfoRepository} from '../repositories';

export class CustomerOrderInfoController {
  constructor(
    @repository(CustomerRepository)
    protected customerRepository: CustomerRepository,
    @repository(OrderInfoRepository)
    protected orderInfoRepository: OrderInfoRepository,
  ) {}

  @get('/customers/{id}/orderChips', {
    responses: {
      '200': {
        description: 'Get all chip orders of a customer',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OrderChip)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<OrderInfo>,
  ): Promise<OrderChip[]> {
    let allOrderChips: OrderChip[] = [];
    this.customerRepository
      .orderInfos(id)
      .find(filter)
      .then(orderInfos => {
        orderInfos.forEach(orderInfo => {
          this.orderInfoRepository
            .orderChips(orderInfo.id)
            .find()
            .then(orderChips => {
              allOrderChips = allOrderChips.concat(orderChips);
            });
        });
      });
    return allOrderChips;
  }

  @get('/customers/{id}/customerOrders', {
    responses: {
      '200': {
        description: 'Get customer orders',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OrderChip)},
          },
        },
      },
    },
  })
  async getCustomerOrders(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.filter(OrderInfo) filter?: Filter<OrderInfo>,
  ): Promise<OrderInfo[]> {
    return this.customerRepository.orderInfos(id).find(filter);
  }

  @post('/customers/{id}/customerOrders')
  @response(200, {
    description: 'Add order to customer cart',
    content: {
      'application/json': {
        schema: {type: 'object', items: getModelSchemaRef(OrderInfo)},
      },
    },
  })
  async addOrderToCustomerCart(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @requestBody() orderInfo: OrderInfo,
  ): Promise<OrderInfo> {
    return this.customerRepository.orderInfos(id).create(orderInfo);
  }
}
