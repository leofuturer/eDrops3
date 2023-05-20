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
  Address
} from '../models';
import { AddressRepository, CustomerRepository } from '../repositories';

export class CustomerAddressController {
  constructor(
    @repository(CustomerRepository) protected customerRepository: CustomerRepository,
    @repository(AddressRepository) protected AddressRepository: AddressRepository,
  ) { }

  @authenticate('jwt')
  @get('/customers/{id}/addresses', {
    responses: {
      '200': {
        description: 'Array of Customer has many Address',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Address)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.query.object('filter') filter?: Filter<Address>,
  ): Promise<Address[]> {
    return this.customerRepository.addresses(id).find(filter);
  }

  @authenticate('jwt')
  @post('/customers/{id}/addresses', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: {'application/json': {schema: getModelSchemaRef(Address)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {
            title: 'NewAddressInCustomer',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) address: Omit<Address, 'id'>,
  ): Promise<Address> {
    return this.customerRepository.addresses(id).create(address);
  }

  @authenticate('jwt')
  @patch('/customers/{id}/addresses/{addressId}', {
    responses: {
      '200': {
        description: 'Customer.Address PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.path.number('addressId') addressId: typeof Address.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {partial: true}),
        },
      },
    })
    address: Partial<Address>,
  ): Promise<Count> {
    return this.customerRepository.addresses(id).patch(address, {id: addressId});
  }

  @authenticate('jwt')
  @del('/customers/{id}/addresses', {
    responses: {
      '200': {
        description: 'Customer.Address DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.query.object('where', getWhereSchemaFor(Address)) where?: Where<Address>,
  ): Promise<Count> {
    return this.customerRepository.addresses(id).delete(where);
  }
}
