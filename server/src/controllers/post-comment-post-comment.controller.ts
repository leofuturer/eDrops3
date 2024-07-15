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
import {PostComment, PostCommentLink} from '../models';
import {PostCommentRepository, PostRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';

export class PostCommentPostCommentController {
  constructor(
    @repository(PostCommentRepository)
    protected postCommentRepository: PostCommentRepository,
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
            schema: {type: 'array', items: getModelSchemaRef(PostComment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<PostComment>,
  ): Promise<PostComment[]> {
    return this.postCommentRepository.postComments(id).find({...filter, where: { top: false }});
  }

  @intercept(AuthorInterceptor.BINDING_KEY)
  @authenticate('jwt')
  @post('/post-comments/{id}/post-comments', {
    responses: {
      '200': {
        description: 'create a PostComment model instance',
        content: {'application/json': {schema: getModelSchemaRef(PostComment)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof PostComment.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PostComment, {
            title: 'NewPostCommentInPostComment',
            exclude: ['id'],
          }),
        },
      },
    })
    postComment: Omit<PostComment, 'id'>,
  ): Promise<PostComment> {
    return this.postCommentRepository
      .postComments(id)
      .create(postComment)
      .then(async postComment => {
        const postId = await this.postCommentRepository
          .findById(id)
          .then(postComment => postComment.postId);
        this.postRepository.findById(postId).then(post => {
          this.postRepository.updateById(postId, {
            comments: post.comments + 1,
          });
        });
        return postComment;
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
          schema: getModelSchemaRef(PostComment, {
            title: 'Edited post comment',
            exclude: ['id'],
          }),
        },
      },
    })
    postComment: Omit<PostComment, 'id'>,
  ): Promise<void> {
    return this.postCommentRepository
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
    return this.postCommentRepository
      .updateById(id, {
        author: "<DELETED>",
        content: "<DELETED>",
        userId: "<DELETED>"
      })
  }
}
