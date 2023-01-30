import { authenticate } from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post, requestBody
} from '@loopback/rest';
import {
  Customer,
  CustomerAddress
} from '../models';
import { CustomerAddressRepository, CustomerRepository } from '../repositories';

export class CustomerCustomerAddressController {
  constructor(
    @repository(CustomerRepository) protected customerRepository: CustomerRepository,
    @repository(CustomerAddressRepository) protected customerAddressRepository: CustomerAddressRepository,
  ) { }

  @authenticate('jwt')
  @get('/customers/{id}/customerAddresses', {
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
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.query.object('filter') filter?: Filter<CustomerAddress>,
  ): Promise<CustomerAddress[]> {
    return this.customerRepository.customerAddresses(id).find(filter);
  }

  @authenticate('jwt')
  @post('/customers/{id}/customerAddresses', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: {'application/json': {schema: getModelSchemaRef(CustomerAddress)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Customer.prototype.id,
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

  @authenticate('jwt')
  @patch('/customers/{id}/customerAddresses/{customerAddressId}', {
    responses: {
      '200': {
        description: 'Customer.CustomerAddress PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.path.number('customerAddressId') customerAddressId: typeof CustomerAddress.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CustomerAddress, {partial: true}),
        },
      },
    })
    customerAddress: Partial<CustomerAddress>,
  ): Promise<Count> {
    return this.customerRepository.customerAddresses(id).patch(customerAddress, {id: customerAddressId});
  }

  @authenticate('jwt')
  @del('/customers/{id}/customerAddresses', {
    responses: {
      '200': {
        description: 'Customer.CustomerAddress DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.query.object('where', getWhereSchemaFor(CustomerAddress)) where?: Where<CustomerAddress>,
  ): Promise<Count> {
    return this.customerRepository.customerAddresses(id).delete(where);
  }
}
