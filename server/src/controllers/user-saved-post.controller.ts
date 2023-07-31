import { authenticate } from '@loopback/authentication';
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef, param, post
} from '@loopback/rest';
import { Post, SavedPost, User } from '../models';
import { PostRepository, UserRepository } from '../repositories';

export class UserSavedPostController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(PostRepository) protected postRepository: PostRepository,
  ) {}

  @authenticate('jwt')
  @get('/users/{id}/saved-posts', {
    responses: {
      '200': {
        description: 'Get all user saved posts',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SavedPost)},
          },
        },
      },
    },
  })
  async getAll(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Post>,
  ): Promise<Post[]> {
    const savedPosts : Post[] = await this.userRepository.savedPosts(id).find(filter);
    return savedPosts;
  }

  @authenticate('jwt')
  @get('/users/{id}/saved-posts/{postId}', {
    responses: {
      '200': {
        description: 'Check if a post is saved',
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
    @param.path.number('postId') postId: typeof Post.prototype.id,
  ): Promise<Post> {
    const savedPosts = await this.userRepository.savedPosts(id).find({where: {id: postId}});
    return savedPosts[0];
  }

  @authenticate('jwt')
  @post('/users/{id}/saved-posts/{postId}', {
    responses: {
      '200': {
        description: 'Save a post',
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('postId') postId: typeof Post.prototype.id,
  ): Promise<void> {
    return this.userRepository.savedPosts(id).link(postId);
  }

  @authenticate('jwt')
  @del('/users/{id}/saved-posts/{postId}', {
    responses: {
      '200': {
        description: 'Unsave a post',
      },
    },
  })
  async delete(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('postId') postId: typeof Post.prototype.id,
  ): Promise<void> {
    return this.userRepository.savedPosts(id).unlink(postId);
  }
}
