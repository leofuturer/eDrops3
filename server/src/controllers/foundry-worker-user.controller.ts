import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  FoundryWorker,
  User,
} from '../models';
import {FoundryWorkerRepository} from '../repositories';

export class FoundryWorkerUserController {
  constructor(
    @repository(FoundryWorkerRepository)
    public foundryWorkerRepository: FoundryWorkerRepository,
  ) { }

  @get('/foundry-workers/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to FoundryWorker',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof FoundryWorker.prototype.id,
  ): Promise<User> {
    return this.foundryWorkerRepository.user(id);
  }
}
