import {
  Filter,
  repository
} from '@loopback/repository';
import {
  HttpErrors,
  Response,
  RestBindings,
  get,
  getModelSchemaRef,
  param, post,
  requestBody,
  response
} from '@loopback/rest';
import { Address, Customer, OrderChip, OrderInfo } from '../models';
import { CustomerRepository, OrderInfoRepository } from '../repositories';
import { request } from 'http';
import { inject } from '@loopback/core';
import { DTO } from '../lib/types';

export class CustomerOrderInfoController {
  constructor(
    @repository(CustomerRepository)
    protected customerRepository: CustomerRepository,
    @repository(OrderInfoRepository)
    protected orderInfoRepository: OrderInfoRepository,
  ) {}

  @get('/customers/{id}/order-chips', {
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
    const customerOrders = await this.customerRepository.orderInfos(id).find({include: [{relation : 'orderChips'}]});
    return customerOrders.reduce((all, orderInfo) => {
      return all.concat(orderInfo.orderChips ?? []);
    }, [] as OrderChip[]);
  }

  @get('/customers/{id}/orders', {
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

  // @post('/customers/{id}/orders')
  // @response(200, {
  //   description: 'Create new order',
  //   content: {
  //     'application/json': {
  //       schema: {type: 'object', items: getModelSchemaRef(OrderInfo)},
  //     },
  //   },
  // })
  // async addOrderToCustomerCart(
  //   @param.path.string('id') id: typeof Customer.prototype.id,
  // ): Promise<OrderInfo> {
  //   return this.customerRepository.createCart(id);
  // }

  @get('/customers/{id}/cart')
  @response(200, {
    description: 'Customer cart',
    content: {
      'application/json': {
        schema: {},
      },
    },
  })
  async getCustomerCart(
    @param.path.string('id') id: string,
  ): Promise<OrderInfo>{
    return this.customerRepository.getCart(id);
  }

  @post('/customers/{id}/orders/{orderId}/checkout')
  @response(200, {
    description: 'Create new order',
    content: {
      'application/json': {
        schema: {type: 'object', items: getModelSchemaRef(OrderInfo)},
      },
    },
  })
  async checkoutCart(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.path.number('orderId') orderId: typeof OrderInfo.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {
            title: 'NewAddress',
            partial: true,
          }),
        },
      },
    })
    address?: DTO<Address>,
  ): Promise<OrderInfo> {
    return this.customerRepository.checkoutCart(id, orderId, address);
  }
}
