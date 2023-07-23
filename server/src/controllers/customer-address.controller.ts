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
            schema: { type: 'array', items: getModelSchemaRef(Address) },
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

  /*
    Goal: 
    Customer should always have 1 default address.
    Customer should be able to have 0 or more non-default addresses.
    - They can set any non-default address as default (replacing the previous default address if there was one)

    Description:
    Adds a new address to the given customer's address list.
    If the user has no default addresses saved, the new address will be set as default.
    If the user already has addresses saved, the new address will not be set as default, unless the user explicitly sets it as default.
  */
  @authenticate('jwt')
  @post('/customers/{id}/addresses', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Address) } },
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
    // Check if the user has any addresses saved
    const hasDefaultAddresses: boolean = await this.customerRepository.addresses(id).find({
      where: { isDefault: true }
    }).then(addresses => addresses.length > 0);
    if (!hasDefaultAddresses) {
      // If the user has no default addresses saved, set the new address as default
      address.isDefault = true;
    }
    else {
      // If the address specifies that it should be set as default, remove default from all other addresses
      if (address.isDefault) {
        const currentDefaults: Address[] = await this.customerRepository.addresses(id).find({ where: { isDefault: true } });
        await Promise.all(currentDefaults.map(async (d) => {
          d.isDefault = false;
          return this.customerRepository.addresses(id).patch(d, { id: d.id });
        }));
      }
    }
    return this.customerRepository.addresses(id).create(address);
  }

  @authenticate('jwt')
  @get('/customers/{id}/addresses/{addressId}', {
    responses: {
      '200': {
        description: 'Customer.Address model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Address) } },
      },
    },
  })
  async findById(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.path.number('addressId') addressId: typeof Address.prototype.id,
  ): Promise<Address> {
    return this.customerRepository.addresses(id).find({ where: { id: addressId } }).then(addresses => addresses[0]);
  }

  @authenticate('jwt')
  @patch('/customers/{id}/addresses/{addressId}', {
    responses: {
      '200': {
        description: 'Customer.Address PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.path.number('addressId') addressId: typeof Address.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, { partial: true }),
        },
      },
    })
    address: Partial<Address>,
  ): Promise<Count> {
    return this.customerRepository.addresses(id).patch(address, { id: addressId });
  }

  @authenticate('jwt')
  @del('/customers/{id}/addresses', {
    responses: {
      '200': {
        description: 'Customer.Address DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
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
