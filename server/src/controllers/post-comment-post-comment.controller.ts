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

export class CommentCommentController {
  constructor(
    @repository(CommentRepository)
    protected commentRepository: CommentRepository,
    @repository(PostRepository)
    protected postRepository: PostRepository,
  ) {}

  @get('/post-comments/{id}/post-comments', {
    responses: {
      '200': {
        description:
          'Array of PostComment has many PostComment through PostCommentLink',
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
  @post('/post-comments/{id}/post-comments', {
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

  @authenticate('jwt')
  @patch('/post-comments/{id}/post-comments', {
    responses: {
      '200': {
        description: 'Edit a comment',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
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
    postComment: Omit<Comment, 'id'>,
  ): Promise<void> {
    return this.commentRepository
      .updateById(id, {
        content: postComment.content,
      })
  }

  @authenticate('jwt')
  @del('/post-comments/{id}/post-comments', {
    responses: {
      '200': {
        description: 'PostComment.PostComment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
  ): Promise<void> {
    return this.commentRepository
      .updateById(id, {
        author: "<DELETED>",
        content: "<DELETED>",
        userId: "<DELETED>"
      })
  }
}
