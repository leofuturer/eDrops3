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
import {
User,
Comment,
} from '../models';
import {UserRepository} from '../repositories';

export class UserPostCommentController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/post-comments', {
    responses: {
      '200': {
        description: 'Array of User has many PostComment through LikedComment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Comment>,
  ): Promise<Comment[]> {
    return this.userRepository.likedComments(id).find(filter);
  }

  @post('/users/{id}/post-comments', {
    responses: {
      '200': {
        description: 'create a PostComment model instance',
        content: {'application/json': {schema: getModelSchemaRef(Comment)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comment, {
            title: 'NewPostCommentInUser',
            exclude: ['id'],
          }),
        },
      },
    }) postComment: Omit<Comment, 'id'>,
  ): Promise<Comment> {
    return this.userRepository.likedComments(id).create(postComment);
  }

  @patch('/users/{id}/post-comments', {
    responses: {
      '200': {
        description: 'User.PostComment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comment, {partial: true}),
        },
      },
    })
    postComment: Partial<Comment>,
    @param.query.object('where', getWhereSchemaFor(Comment)) where?: Where<Comment>,
  ): Promise<Count> {
    return this.userRepository.likedComments(id).patch(postComment, where);
  }

  @del('/users/{id}/post-comments', {
    responses: {
      '200': {
        description: 'User.PostComment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Comment)) where?: Where<Comment>,
  ): Promise<Count> {
    return this.userRepository.likedComments(id).delete(where);
  }
}
