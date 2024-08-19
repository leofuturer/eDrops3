import {authenticate} from '@loopback/authentication';
import {Count, CountSchema, Filter, repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, post} from '@loopback/rest';
import {User, Comment, LikedComment, Post} from '../models';
import {CommentRepository, UserRepository} from '../repositories';

export class UserLikedCommentController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(CommentRepository)
    protected postCommentRepository: CommentRepository,
  ) {}

  @authenticate('jwt')
  @get('/users/{id}/liked-comments', {
    responses: {
      '200': {
        description: 'Get all user liked comments',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comment)},
          },
        },
      },
    },
  })
  async getAll(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.query.object('filter') filter?: Filter<Comment>,
  ): Promise<Comment[]> {
    const likedComments: Comment[] = await this.userRepository
      .likedComments(id)
      .find(filter);
    return likedComments;
  }

  @authenticate('jwt')
  @get('/users/{id}/liked-comments/{commentId}', {
    responses: {
      '200': {
        description: 'Check if a comment is liked',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LikedComment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.path.number('commentId') commentId: typeof Comment.prototype.id,
  ): Promise<Comment> {
    const likedComments = await this.userRepository
      .likedComments(id)
      .find({where: {id: commentId}});
    return likedComments[0];
  }

  @authenticate('jwt')
  @post('/users/{id}/liked-comments/{commentId}', {
    responses: {
      '200': {
        description: 'Like a comment',
        content: {
          'application/json': {schema: getModelSchemaRef(LikedComment)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('commentId') commentId: typeof Comment.prototype.id,
  ): Promise<void> {
    this.userRepository
      .likedComments(id)
      .link(commentId)
      .then(() =>
        this.postCommentRepository.findById(commentId).then(comment =>
          this.postCommentRepository.updateById(commentId, {
            likes: comment.likes + 1,
          }),
        ),
      );
  }

  @authenticate('jwt')
  @del('/users/{id}/liked-comments/{commentId}', {
    responses: {
      '200': {
        description: 'Unlike a comment',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('commentId') commentId: typeof Comment.prototype.id,
  ): Promise<void> {
    this.userRepository
      .likedComments(id)
      .unlink(commentId)
      .then(() =>
        this.postCommentRepository.findById(commentId).then(comment =>
          this.postCommentRepository.updateById(commentId, {
            likes: comment.likes - 1,
          }),
        ),
      );
  }
}
