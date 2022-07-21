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
import {User, SavedProject, Project} from '../models';
import {UserRepository} from '../repositories';

export class UserSavedProjectController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/users/{id}/savedProjects', {
    responses: {
      '200': {
        description: 'Array of User has many SavedProject',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SavedProject)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<SavedProject>,
  ): Promise<SavedProject[]> {
    return this.userRepository.savedProjects(id).find(filter);
  }

  @post('/users/{id}/savedProjects/{projectId}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(SavedProject)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('projectId') projectId: typeof Project.prototype.id,
  ): Promise<SavedProject> {
    return this.userRepository.savedProjects(id).create({projectId});
  }

  @del('/users/{id}/savedProjects/{projectId}', {
    responses: {
      '200': {
        description: 'User.SavedProject DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('projectId') projectId: typeof Project.prototype.id,
  ): Promise<Count> {
    return this.userRepository.savedProjects(id).delete({projectId});
  }
}
