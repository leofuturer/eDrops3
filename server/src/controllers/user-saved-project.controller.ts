import { authenticate } from '@loopback/authentication';
import {
  CountSchema,
  Filter,
  repository
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef, param, post
} from '@loopback/rest';
import { Project, SavedProject, User } from '../models';
import { ProjectRepository, UserRepository } from '../repositories';

export class UserSavedProjectController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
  ) {}

  @authenticate('jwt')
  @get('/users/{id}/savedProjects', {
    responses: {
      '200': {
        description: 'Get all user saved projects',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          }
        }
      }
    }
  })
  async getAll(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.query.object('filter') filter?: Filter<Project>,
  ): Promise<Project[]> {
    const savedProjects : Project[] = await this.userRepository.savedProjects(id).find(filter);
    return savedProjects;
  }

  @authenticate('jwt')
  @get('/users/{id}/savedProjects/{projectId}', {
    responses: {
      '200': {
        description: 'Check if a project is saved',
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
    @param.path.number('projectId') projectId: typeof Project.prototype.id,
  ): Promise<Project> {
    const savedProjects = await this.userRepository.savedProjects(id).find({where: {id: projectId}});
    return savedProjects[0];
  }

  @authenticate('jwt')
  @post('/users/{id}/savedProjects/{projectId}', {
    responses: {
      '200': {
        description: 'Save a project',
        content: {
          'application/json': {schema: getModelSchemaRef(SavedProject)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('projectId') projectId: typeof Project.prototype.id,
  ): Promise<void> {
    return this.userRepository.savedProjects(id).link(projectId);
  }

  @authenticate('jwt')
  @del('/users/{id}/savedProjects/{projectId}', {
    responses: {
      '200': {
        description: 'Unsave a project',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('projectId') projectId: typeof Project.prototype.id,
  ): Promise<void> {
    return this.userRepository.savedProjects(id).unlink(projectId);
  }
}
