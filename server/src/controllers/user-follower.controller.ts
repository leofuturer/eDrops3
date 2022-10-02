import {authenticate} from '@loopback/authentication';
import {CountSchema, Filter, repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, post} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';

export class UserFollowerController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @authenticate('jwt')
  @get('/users/{id}/followers', {
    responses: {
      '200': {
        description: 'Get User followers',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getAll(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.followers(id).find(filter);
  }

  @authenticate('jwt')
  @get('/users/{id}/followers/{followerId}', {
    responses: {
      '200': {
        description: 'Check if user is followed by another user',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async find(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.string('followerId') followerId: typeof User.prototype.id,
  ): Promise<User> {
    const followers = await this.userRepository
      .followers(id)
      .find({where: {id: followerId}});
    return followers[0];
  }

  @post('/users/{id}/followers/{followerId}', {
    responses: {
      '200': {
        description: 'Follow a user',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.string('followerId') followerId: typeof User.prototype.id,
  ): Promise<void> {
    return this.userRepository.followers(id).link(followerId);
  }

  @del('/users/{id}/followers/{followerId}', {
    responses: {
      '200': {
        description: 'Unfollow a user',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.path.string('followerId') followerId: typeof User.prototype.id,
  ): Promise<void> {
    return this.userRepository.followers(id).unlink(followerId);
  }
}
