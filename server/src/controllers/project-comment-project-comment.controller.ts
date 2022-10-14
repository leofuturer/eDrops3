import {intercept} from '@loopback/core';
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
import {AuthorInterceptor} from '../interceptors';
import {ProjectComment, ProjectCommentLink} from '../models';
import {ProjectCommentRepository, ProjectRepository} from '../repositories';

export class ProjectCommentProjectCommentController {
  constructor(
    @repository(ProjectCommentRepository)
    protected projectCommentRepository: ProjectCommentRepository,
    @repository(ProjectRepository)
    protected projectRepository: ProjectRepository,
  ) {}

  @get('/projectComments/{id}/projectComments', {
    responses: {
      '200': {
        description:
          'Array of ProjectComment has many ProjectComment through ProjectCommentLink',
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
    return this.projectCommentRepository
      .projectComments(id)
      .find({...filter, where: {top: false}});
  }

  @intercept(AuthorInterceptor.BINDING_KEY)
  @post('/projectComments/{id}/projectComments', {
    responses: {
      '200': {
        description: 'create a ProjectComment model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(ProjectComment)},
        },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof ProjectComment.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectComment, {
            title: 'NewProjectCommentInProjectComment',
            exclude: ['id'],
          }),
        },
      },
    })
    projectComment: Omit<ProjectComment, 'id'>,
  ): Promise<ProjectComment> {
    return this.projectCommentRepository
      .projectComments(id)
      .create(projectComment)
      .then(async projectComment => {
        const projectId = await this.projectCommentRepository
          .findById(id)
          .then(projectComment => projectComment.projectId);
        this.projectRepository.findById(projectId).then(project => {
          this.projectRepository.updateById(projectId, {
            comments: project.comments + 1,
          });
        });
        return projectComment;
      });
  }

  @patch('/projectComments/{id}/projectComments', {
    responses: {
      '200': {
        description: 'ProjectComment.ProjectComment PATCH success count',
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
    return this.projectCommentRepository
      .projectComments(id)
      .patch(projectComment, where);
  }

  @del('/projectComments/{id}/projectComments', {
    responses: {
      '200': {
        description: 'ProjectComment.ProjectComment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProjectComment))
    where?: Where<ProjectComment>,
  ): Promise<Count> {
    return this.projectCommentRepository
      .projectComments(id)
      .delete(where)
      .then(async count => {
        const projectId = await this.projectCommentRepository
          .findById(id)
          .then(projectComment => {
            return projectComment.projectId;
          });
        this.projectRepository.findById(projectId).then(project => {
          this.projectRepository.updateById(projectId, {
            comments: project.comments - count.count,
          });
        });
        return count;
      });
  }
}
