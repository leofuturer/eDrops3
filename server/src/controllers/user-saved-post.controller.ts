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
import {User, SavedPost, Post} from '../models';
import {UserRepository} from '../repositories';

export class UserSavedPostController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/users/{id}/savedPosts', {
    responses: {
      '200': {
        description: 'Array of User has many SavedPost',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SavedPost)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<SavedPost>,
  ): Promise<SavedPost[]> {
    return this.userRepository.savedPosts(id).find(filter);
  }

  @post('/users/{id}/savedPosts/{postId}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(SavedPost)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('postId') postId: typeof Post.prototype.id,
  ): Promise<SavedPost> {
    return this.userRepository.savedPosts(id).create({
      postId,
    });
  }

  @del('/users/{id}/savedPosts/{postId}', {
    responses: {
      '200': {
        description: 'User.SavedPost DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('postId') postId: typeof Post.prototype.id,
  ): Promise<Count> {
    return this.userRepository.savedPosts(id).delete({postId});
  }
}
