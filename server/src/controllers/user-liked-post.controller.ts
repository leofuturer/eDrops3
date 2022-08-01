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
import { LikedPost, Post, User } from '../models';
import { PostRepository, UserRepository } from '../repositories';

export class UserLikedPostController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(PostRepository) protected postRepository: PostRepository,
  ) {}

  @authenticate('jwt')
  @get('/users/{id}/likedPosts', {
    responses: {
      '200': {
        description: 'Get all user liked posts',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LikedPost)},
          },
        },
      },
    },
  })
  async getAll(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Post>,
  ): Promise<Post[]> {
    const likedPosts : Post[] = await this.userRepository.likedPosts(id).find(filter);
    return likedPosts;
  }

  @authenticate('jwt')
  @get('/users/{id}/likedPosts/{postId}', {
    responses: {
      '200': {
        description: 'Check if a post is liked',
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
    const likedPosts = await this.userRepository.likedPosts(id).find({where: {id: postId}});
    return likedPosts[0];
  }

  @authenticate('jwt')
  @post('/users/{id}/likedPosts/{postId}', {
    responses: {
      '200': {
        description: 'Like a post',
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('postId') postId: typeof Post.prototype.id,
  ): Promise<void> {
    return this.userRepository.likedPosts(id).link(postId);
  }

  @authenticate('jwt')
  @del('/users/{id}/likedPosts/{postId}', {
    responses: {
      '200': {
        description: 'Unlike a post',
      },
    },
  })
  async delete(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('postId') postId: typeof Post.prototype.id,
  ): Promise<void> {
    return this.userRepository.likedPosts(id).unlink(postId);
  }
}
