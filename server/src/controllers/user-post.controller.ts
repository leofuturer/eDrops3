import { intercept } from '@loopback/core';
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
import { AuthorInterceptor } from '../interceptors';
import {
  User,
  Post,
} from '../models';
import {UserRepository} from '../repositories';

export class UserPostController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/posts', {
    responses: {
      '200': {
        description: 'Array of User has many Post',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Post)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Post>,
  ): Promise<Post[]> {
    return this.userRepository.posts(id).find(filter);
  }

  @intercept(AuthorInterceptor.BINDING_KEY)
  @post('/users/{id}/posts', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Post)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {
            title: 'NewPostInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) post: Omit<Post, 'id'>,
  ): Promise<Post> {
    return this.userRepository.posts(id).create(post);
  }

  @patch('/users/{id}/posts/{postId}', {
    responses: {
      '200': {
        description: 'User.Post PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @param.path.number('postId') postId: typeof Post.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {partial: true}),
        },
      },
    })
    post: Partial<Post>
  ): Promise<Count> {
    return this.userRepository.posts(id).patch(post, {id: postId});
  }

  @del('/users/{id}/posts/{postId}', {
    responses: {
      '200': {
        description: 'Delete a post',
      },
    },
  })
  async delete(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('postId') postId: typeof Post.prototype.id,
  ): Promise<Count> {
    return this.userRepository
      .posts(id)
      .delete({id: postId});
  }
}
