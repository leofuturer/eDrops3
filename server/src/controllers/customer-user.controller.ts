import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Customer,
  User,
} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerUserController {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
  ) { }

  @get('/customers/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Customer',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Customer.prototype.id,
  ): Promise<User> {
    return this.customerRepository.user(id);
  }
}
