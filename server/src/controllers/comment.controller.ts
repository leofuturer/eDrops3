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
import {Post, Comment} from '../models';
import {CommentRepository, PostRepository, ProjectRepository} from '../repositories';

export class CommentController {
  constructor(
    @repository(PostRepository) protected postRepository: PostRepository,
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
    @repository(CommentRepository)
    protected comments: CommentRepository,
  ) {}

  @get('/comments/{type}/{id}', {
    responses: {
      '200': {
        description: 'Get comments for a post or project',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('type') type: string,
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Comment>,
  ): Promise<Comment[]> {
    if (type=='post') return this.postRepository.postComments(id).find({...filter, where: {top: true, parentType: 'post'}});
    else return this.projectRepository.projectComments(id).find({...filter, where: {top: true, parentType: 'project'}});
  }

  @get('/commentCount/{type}/{id}', {
    responses: {
      '200': {
        description: 'Number of comments for a post or project',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comment)},
          },
        },
      },
    },
  })
  async commentCount(
    @param.path.string('type') type: string,
    @param.path.number('id') id: number
  ): Promise<Count> {
    return this.comments.count({parentId: id, parentType: type});
  }

  @intercept(AuthorInterceptor.BINDING_KEY)
  @post('/comments/{type}/{id}', {
    responses: {
      '200': {
        description: 'Create a comment',
        content: {'application/json': {schema: getModelSchemaRef(Comment)}},
      },
    },
  })
  async create(
    @param.path.string('type') type: string,
    @param.path.number('id') id: typeof Post.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comment, {
            title: 'NewPostCommentInPost',
            exclude: ['id'],
            optional: ['parentId', 'parentType'],
          }),
        },
      },
    })
    comment: Omit<Comment, 'id'>,
  ): Promise<Comment> {
    comment.parentType = type;
    comment.parentId = id;
    if (type=='post') {
      return this.postRepository
      .postComments(id)
      .create(comment)
      .then(c => {
        this.postRepository.findById(id).then(post => {
          this.postRepository.updateById(id, {comments: post.comments + 1});
        });
        return c;
      });
    }
    else {
      return this.projectRepository
      .projectComments(id)
      .create(comment)
      .then(c => {
        this.projectRepository.findById(id).then(project => {
          this.projectRepository.updateById(id, {comments: project.comments+1});
        });
        return c;
      })
    }
  }

  @patch('/comments/{commentId}', {
    responses: {
      '200': {
        description: 'Edit a comment',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('commentId') commentId: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comment, {
            title: 'Edited post comment',
            exclude: ['id'],
          }),
        },
      },
    })
    comment: Omit<Comment, 'id'>,
  ): Promise<void> {
    return this.comments
      .updateById(commentId, {
        content: comment.content,
      })
  }

  @del('/comments/{commentId}', {
    responses: {
      '200': {
        description: 'Post.PostComment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('commentId') commentId: number,
  ): Promise<void> {
    return this.comments
      .updateById(commentId, {
        author: "<DELETED>",
        content: "<DELETED>",
        userId: "<DELETED>"
      })
  }
}
