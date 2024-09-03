import { inject, intercept } from '@loopback/core';
import { Filter, FilterExcludingWhere, repository } from '@loopback/repository';
import {
  Request,
  RestBindings,
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response
} from '@loopback/rest';
import { CustomerCreateInterceptor } from '../interceptors';
import { DTO } from '../lib/types/model';
import { Address, Customer, User } from '../models';
import { CustomerRepository, UserRepository } from '../repositories';

export class CustomerController {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) { }

  @intercept(CustomerCreateInterceptor.BINDING_KEY)
  @post('/customers')
  @response(200, {
    description: 'Customer model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Customer) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    customer: DTO<Customer & User & Address>,
  ): Promise<Customer> {
    return this.customerRepository.createCustomer(customer, this.request.headers.origin);
  }

  @get('/customers')
  @response(200, {
    description: 'Array of Customer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Customer, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Customer) filter?: Filter<Customer>,
  ): Promise<Customer[]> {
    return this.customerRepository.find({ include: ['user', 'addresses'], ...filter });
  }

  @get('/customers/{id}')
  @response(200, {
    description: 'Customer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Customer, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Customer, { exclude: 'where' })
    filter?: FilterExcludingWhere<Customer>,
  ): Promise<Customer> {
    return this.customerRepository.findById(id, { include: ['user', 'addresses'], ...filter });
  }

  @del('/customers/{id}')
  @response(204, {
    description: 'Customer DELETE success',
  })
  async deleteById(@param.path.number('string') id: string): Promise<void> {
    await this.customerRepository.deleteCustomer(id);
  }

  @patch('/customers/{id}')
  @response(204, {
    description: 'Customer PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, { partial: true }),
        },
      },
    })
    customer: Customer,
  ): Promise<void> {
    await this.customerRepository.updateById(id, customer);
  }
}
