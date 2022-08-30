import {authenticate} from '@loopback/authentication';
import {Count, CountSchema, Filter, repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, post} from '@loopback/rest';
import {Project, LikedProject, User} from '../models';
import {ProjectRepository, UserRepository} from '../repositories';

export class UserLikedProjectController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(ProjectRepository)
    protected projectRepository: ProjectRepository,
  ) {}

  @authenticate('jwt')
  @get('/users/{id}/likedProjects', {
    responses: {
      '200': {
        description: 'Get all user liked projects',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async getAll(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.query.object('filter') filter?: Filter<Project>,
  ): Promise<Project[]> {
    const likedProjects: Project[] = await this.userRepository
      .likedProjects(id)
      .find(filter);
    return likedProjects;
  }

  @authenticate('jwt')
  @get('/users/{id}/likedProjects/{projectId}', {
    responses: {
      '200': {
        description: 'Check if a project is liked',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LikedProject)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.path.number('projectId') projectId: typeof Project.prototype.id,
  ): Promise<Project> {
    const likedProjects = await this.userRepository
      .likedProjects(id)
      .find({where: {id: projectId}});
    return likedProjects[0];
  }

  @authenticate('jwt')
  @post('/users/{id}/likedProjects/{projectId}', {
    responses: {
      '200': {
        description: 'Like a project',
        content: {
          'application/json': {schema: getModelSchemaRef(LikedProject)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('projectId') projectId: typeof Project.prototype.id,
  ): Promise<void> {
    this.userRepository
      .likedProjects(id)
      .link(projectId)
      .then(() =>
        this.projectRepository.findById(projectId).then(project =>
          this.projectRepository.updateById(projectId, {
            likes: project.likes + 1,
          }),
        ),
      );
  }

  @authenticate('jwt')
  @del('/users/{id}/likedProjects/{projectId}', {
    responses: {
      '200': {
        description: 'Unlike a project',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('projectId') projectId: typeof Project.prototype.id,
  ): Promise<void> {
    this.userRepository
      .likedProjects(id)
      .unlink(projectId)
      .then(() =>
        this.projectRepository.findById(projectId).then(project =>
          this.projectRepository.updateById(projectId, {
            likes: project.likes - 1,
          }),
        ),
      );
  }
}
