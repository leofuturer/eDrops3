import { authenticate } from '@loopback/authentication';
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
import {ProjectRepository, UserRepository} from '../repositories';

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
  ): Promise<Project[]> {
    const savedProjects : SavedProject[] = await this.userRepository.savedProjects(id).find();
    const projects: Project[] = await Promise.all(savedProjects.map(async (savedProject) => {
      const project = await this.projectRepository.findById(savedProject.projectId);
      return project;
    })).then((data) => {
      return data.flat();
    })
    return projects;
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
  ): Promise<SavedProject> {
    const savedProjects = await this.userRepository.savedProjects(id).find({where: {projectId: projectId}});
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
  ): Promise<SavedProject> {
    return this.userRepository.savedProjects(id).create({projectId});
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
  ): Promise<Count> {
    return this.userRepository.savedProjects(id).delete({projectId});
  }
}
