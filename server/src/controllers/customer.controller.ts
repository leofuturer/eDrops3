import {inject, intercept} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  Response,
  response,
  RestBindings,
} from '@loopback/rest';
import {CustomerCreateInterceptor} from '../interceptors';
import {Customer, CustomerAddress, OrderInfo, User} from '../models';
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
          schema: {
            type: 'object',
          }
          // schema: getModelSchemaRef(Customer, {
          //   title: 'NewCustomer',
          //   exclude: ['id'],
          //   includeRelations: true,
          // }),
        },
      },
    })
    customer: Omit<Customer & CustomerAddress, 'id'>,
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
      throw new HttpErrors.NotFound('Customer not found');
    }
    await this.customerRepository.sendVerificationEmail(customer as Customer);
  }

  @get('/customers/verify')
  @response(200, {
    description: 'Customer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Customer, {includeRelations: true}),
      },
    },
  })
  async verify(
    @param.query.string('customerId') customerId: string,
    @param.query.string('token') verificationToken: string,
    @inject(RestBindings.Http.RESPONSE) response: Response
  ): Promise<Customer> {
    const customer = await this.customerRepository.verifyEmail(customerId, verificationToken);
    console.log(customer);
    if (!customer) {
      throw new HttpErrors.NotFound('Customer not found');
    }
    if(customer.emailVerified) {
      response.redirect('/emailVerified')
    }
    else {
      response.redirect('/emailVerifyInvalid')
    }
    return customer;
  }


  @get('/customers/getApi')
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
        token: (process.env.SHOPIFY_STORE !== 'test'
          ? process.env.SHOPIFY_TOKEN
          : process.env.SHOPIFY_TOKEN_TEST) as string,
        domain: (process.env.SHOPIFY_STORE !== 'test'
          ? process.env.SHOPIFY_DOMAIN
          : process.env.SHOPIFY_DOMAIN_TEST) as string,
      },
    };
  }

  @get('/customers/{id}/getCustomerCart')
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
  ): Promise<Partial<OrderInfo> | number | Error> {
    return this.customerRepository.getCustomerCart(id);
  }

  @post('/customers/credsTaken')
  @response(200, {
    description: 'Check if creds are taken',
    content: {
      'application/json': {
        schema: {
          properties: {
            usernameTaken: {
              type: 'boolean',
            },
            emailTaken: {
              type: 'boolean',
            },
          },
        },
      },
    },
  })
  async checkCredsTaken(
    @requestBody() body: {username: string; email: string},
  ): Promise<{usernameTaken: boolean; emailTaken: boolean}> {
    if (!body.username && !body.email) {
      throw new HttpErrors.NotFound('Missing username and/or email keys');
    }

    const usernameTaken = await this.customerRepository
      .findOne({
        where: {
          username: body.username,
        },
      })
      .then(customer => {
        return !!customer;
      })
      .catch(err => {
        throw new HttpErrors.InternalServerError(err);
      });

    const emailTaken = await this.customerRepository
      .findOne({
        where: {
          email: body.email,
        },
      })
      .then(customer => {
        return !!customer;
      })
      .catch(err => {
        throw new HttpErrors.InternalServerError(err);
      });
    
    return {usernameTaken, emailTaken};
  }
}
