import {intercept} from '@loopback/core';
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
import {CustomerCreateInterceptor} from '../interceptors';
import {Customer, User} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerController {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
  ) {}

  @intercept(CustomerCreateInterceptor.BINDING_KEY)
  @post('/customers')
  @response(200, {
    description: 'Customer model instance',
    content: {'application/json': {schema: getModelSchemaRef(Customer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {
            title: 'NewCustomer',
            exclude: ['id'],
            includeRelations: true,
          }),
        },
      },
    })
    customer: Omit<Customer & User, 'id'>,
  ): Promise<Customer> {
    return this.customerRepository.createCustomer(customer);
  }

  @get('/customers')
  @response(200, {
    description: 'Array of Customer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Customer, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Customer) filter?: Filter<Customer>,
  ): Promise<Customer[]> {
    return this.customerRepository.find(filter);
  }

  @get('/customers/{id}')
  @response(200, {
    description: 'Customer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Customer, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Customer, {exclude: 'where'})
    filter?: FilterExcludingWhere<Customer>,
  ): Promise<Customer> {
    return this.customerRepository.findById(id, filter);
  }

  @del('/customers/{id}')
  @response(204, {
    description: 'Customer DELETE success',
  })
  async deleteById(@param.path.number('string') id: string): Promise<void> {
    await this.customerRepository.deleteById(id);
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
          schema: getModelSchemaRef(Customer, {partial: true}),
        },
      },
    })
    customer: Customer,
  ): Promise<void> {
    await this.customerRepository.updateById(id, customer);
  }

  @post('/customers/resendVerifyEmail')
  @response(200, {
    description: 'Resend verification email',
  })
  async resendVerifyEmail(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              email: {
                type: 'string',
              },
            },
            required: ['email'],
          },
        },
      },
    })
    email: {
      email: string;
    },
  ): Promise<void> {
    // console.log(email);
    const customer = await this.customerRepository.findOne({
      where: {
        email: email.email,
      },
    });
    if (!customer) {
      throw new Error('Customer not found');
    }
    await this.customerRepository.sendVerificationEmail(customer as Customer);
  }

  @get('/customers/getApiToken')
  @response(200, {
    description: 'Get API key and domain',
    content: {
      'application/json': {
        schema: {
          properties: {
            info: {
              properties: {
                token: {
                  type: 'string',
                },
                domain: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async getApiToken(): Promise<object> {
    return {
      info: {
        token: process.env.SHOPIFY_TOKEN,
        domain: process.env.SHOPIFY_DOMAIN,
      },
    };
  }
}
