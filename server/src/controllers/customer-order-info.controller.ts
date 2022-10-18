import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param, post,
  requestBody,
  response
} from '@loopback/rest';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { Customer, OrderChip, OrderInfo } from '../models';
import { CustomerRepository, OrderInfoRepository } from '../repositories';

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
    @param.path.string('id') id: typeof Customer.prototype.id,
  ): Promise<OrderChip[]> {
    let allOrderChips: OrderChip[] = [];
    const customerOrders = await this.customerRepository.orderInfos(id).find({include: [{relation : 'orderChips'}]});
    customerOrders.map((orderInfo) => {
      allOrderChips = allOrderChips.concat.apply(allOrderChips, orderInfo.orderChips);
    });

    return allOrderChips;
  }

  @get('/customers/{id}/customerOrders', {
    responses: {
      '200': {
        description: 'Get customer orders',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OrderInfo)},
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
