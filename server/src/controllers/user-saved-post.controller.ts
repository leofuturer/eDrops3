import {authenticate} from '@loopback/authentication';
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
import {UserRepository, PostRepository} from '../repositories';

export class UserSavedPostController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(PostRepository) protected postRepository: PostRepository,
  ) {}

  @authenticate('jwt')
  @get('/users/{id}/savedPosts', {
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
    @param.query.object('filter') filter?: Filter<SavedPost>,
  ): Promise<Post[]> {
    const savedPosts : SavedPost[] = await this.userRepository.savedPosts(id).find();
    const posts: Post[] = await Promise.all(savedPosts.map(async (savedPost) => {
      const post = await this.postRepository.findById(savedPost.postId);
      return post;
    })).then((data) => {
      return data.flat();
    })
    return posts;
  }

  @authenticate('jwt')
  @get('/users/{id}/savedPosts/{postId}', {
    responses: {
      '200': {
        description: 'Check if a post is saved',
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
    @param.path.number('postId') postId: typeof Post.prototype.id,
  ): Promise<SavedPost> {
    const savedPosts = await this.userRepository.savedPosts(id).find({where: {postId: postId}});
    return savedPosts[0];
  }

  @authenticate('jwt')
  @post('/users/{id}/savedPosts/{postId}', {
    responses: {
      '200': {
        description: 'Save a post',
        content: {'application/json': {schema: getModelSchemaRef(SavedPost)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('postId') postId: typeof Post.prototype.id,
  ): Promise<SavedPost> {
    return this.userRepository.savedPosts(id).create({postId});
  }

  @authenticate('jwt')
  @del('/users/{id}/savedPosts/{postId}', {
    responses: {
      '200': {
        description: 'Unsave a post',
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
