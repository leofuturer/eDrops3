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
import {intercept} from '@loopback/core';
import {AuthorInterceptor} from '../interceptors';
import {Project, ProjectComment} from '../models';
import {ProjectCommentRepository, ProjectRepository} from '../repositories';

export class ProjectProjectCommentController {
  constructor(
    @repository(ProjectRepository)
    protected projectRepository: ProjectRepository,
    @repository(ProjectCommentRepository)
    protected projectComments: ProjectCommentRepository,
  ) {}

  @get('/projects/{id}/project-comments', {
    responses: {
      '200': {
        description: 'Array of Project has many ProjectComment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProjectComment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ProjectComment>,
  ): Promise<ProjectComment[]> {
    return this.projectRepository
      .projectComments(id)
      .find({...filter, where: {top: true}});
  }

  @get('/projects/{id}/commentCount', {
    responses: {
      '200': {
        description: 'Number of ProjectComments for a Project',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProjectComment)},
          },
        },
      },
    },
  })
  async commentCount(@param.path.number('id') id: number): Promise<Count> {
    return this.projectComments.count({projectId: id});
  }

  @intercept(AuthorInterceptor.BINDING_KEY)
  @post('/projects/{id}/project-comments', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(ProjectComment)},
        },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Project.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectComment, {
            title: 'NewProjectCommentInProject',
            exclude: ['id'],
            optional: ['projectId'],
          }),
        },
      },
    })
    projectComment: Omit<ProjectComment, 'id'>,
  ): Promise<ProjectComment> {
    return this.projectRepository
      .projectComments(id)
      .create(projectComment)
      .then(comment => {
        this.projectRepository.findById(id).then(project => {
          this.projectRepository.updateById(id, {
            comments: project.comments + 1,
          });
        });
        return comment;
      });
  }

  @patch('/projects/{id}/project-comments', {
    responses: {
      '200': {
        description: 'Project.ProjectComment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectComment, {partial: true}),
        },
      },
    })
    projectComment: Partial<ProjectComment>,
    @param.query.object('where', getWhereSchemaFor(ProjectComment))
    where?: Where<ProjectComment>,
  ): Promise<Count> {
    return this.projectRepository
      .projectComments(id)
      .patch(projectComment, where);
  }

  @del('/projects/{id}/project-comments', {
    responses: {
      '200': {
        description: 'Project.ProjectComment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProjectComment))
    where?: Where<ProjectComment>,
  ): Promise<Count> {
    return this.projectRepository
      .projectComments(id)
      .delete(where)
      .then(count => {
        this.projectRepository.findById(id).then(project => {
          this.projectRepository.updateById(id, {
            comments: project.comments - count.count,
          });
        });
        return count;
      });
  }
}
