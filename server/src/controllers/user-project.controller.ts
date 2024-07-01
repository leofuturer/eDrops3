import { intercept } from '@loopback/core';
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
  post,
  requestBody
} from '@loopback/rest';
import { AuthorInterceptor } from '../interceptors';
import {
  Project, User
} from '../models';
import { UserRepository } from '../repositories';

export class UserProjectController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/projects', {
    responses: {
      '200': {
        description: 'Array of User has many Project',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Project>,
  ): Promise<Project[]> {
    return this.userRepository.projects(id).find(filter);
  }

  @intercept(AuthorInterceptor.BINDING_KEY)
  @post('/users/{id}/projects', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Project)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {
            title: 'NewProjectInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) project: Omit<Project, 'id'>,
  ): Promise<Project> {
    return this.userRepository.projects(id).create(project);
  }

  @patch('/users/{id}/projects/{projectId}', {
    responses: {
      '200': {
        description: 'User.Project PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @param.path.number('projectId') projectId: typeof Project.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {partial: true}),
        },
      },
    })
    project: Partial<Project>,
  ): Promise<Count> {
    return this.userRepository.projects(id).patch(project, {id: projectId});
  }

  @del('/users/{id}/projects/{projectId}', {
    responses: {
      '200': {
        description: 'User.Project DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.path.number('projectId') projectId: typeof Project.prototype.id,
  ): Promise<Count> {
    return this.userRepository.projects(id).delete({id: projectId});
  }
}
