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
  CustomerAddress,
} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerCustomerAddressController {
  constructor(
    @repository(CustomerRepository) protected customerRepository: CustomerRepository,
  ) { }

  @get('/customers/{id}/customer-addresses', {
    responses: {
      '200': {
        description: 'Array of Customer has many CustomerAddress',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(CustomerAddress)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<CustomerAddress>,
  ): Promise<CustomerAddress[]> {
    return this.customerRepository.customerAddresses(id).find(filter);
  }

  @post('/customers/{id}/customer-addresses', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: {'application/json': {schema: getModelSchemaRef(CustomerAddress)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Customer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CustomerAddress, {
            title: 'NewCustomerAddressInCustomer',
            exclude: ['id'],
            optional: ['customerId']
          }),
        },
      },
    }) customerAddress: Omit<CustomerAddress, 'id'>,
  ): Promise<CustomerAddress> {
    return this.customerRepository.customerAddresses(id).create(customerAddress);
  }

  @patch('/customers/{id}/customer-addresses', {
    responses: {
      '200': {
        description: 'Customer.CustomerAddress PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CustomerAddress, {partial: true}),
        },
      },
    })
    customerAddress: Partial<CustomerAddress>,
    @param.query.object('where', getWhereSchemaFor(CustomerAddress)) where?: Where<CustomerAddress>,
  ): Promise<Count> {
    return this.customerRepository.customerAddresses(id).patch(customerAddress, where);
  }

  @del('/customers/{id}/customer-addresses', {
    responses: {
      '200': {
        description: 'Customer.CustomerAddress DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(CustomerAddress)) where?: Where<CustomerAddress>,
  ): Promise<Count> {
    return this.customerRepository.customerAddresses(id).delete(where);
  }
}
