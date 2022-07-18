import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Admin,
  User
} from '../models';
import { AdminRepository } from '../repositories';

export class AdminUserController {
  constructor(
    @repository(AdminRepository)
    public adminRepository: AdminRepository,
  ) { }

  @get('/admins/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Admin',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Admin.prototype.id,
  ): Promise<User> {
    return this.adminRepository.user(id);
  }
}
