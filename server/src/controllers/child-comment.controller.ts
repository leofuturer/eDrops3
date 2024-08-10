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
import {Comment, CommentLink} from '../models';
import {CommentRepository, PostRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';

export class ChildCommentController {
  constructor(
    @repository(CommentRepository)
    protected commentRepository: CommentRepository,
    @repository(PostRepository)
    protected postRepository: PostRepository,
  ) {}

  // get all the reply comments for a given toplevel comment
  @get('/child-comments/{id}', {
    responses: {
      '200': {
        description:
          'Get all child comments for a given comment id',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Comment>,
  ): Promise<Comment[]> {
    return this.commentRepository.comments(id).find({...filter, where: { top: false }});
  }

  @intercept(AuthorInterceptor.BINDING_KEY)
  @authenticate('jwt')
  @post('/child-comments/{commentId}', {
    responses: {
      '200': {
        description: 'create a PostComment model instance',
        content: {'application/json': {schema: getModelSchemaRef(Comment)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Comment.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comment, {
            title: 'NewPostCommentInPostComment',
            exclude: ['id'],
          }),
        },
      },
    })
    comment: Omit<Comment, 'id'>,
  ): Promise<Comment> {
    return this.commentRepository
      .comments(id)
      .create(comment)
      .then(async comment => {
        const postId = await this.commentRepository
          .findById(id)
          .then(comment => comment.parentId);
        this.postRepository.findById(postId).then(post => {
          this.postRepository.updateById(postId, {
            comments: post.comments + 1,
          });
        });
        return comment;
      });
  }
}
