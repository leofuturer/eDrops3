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
  Post,
  PostComment,
} from '../models';
import {PostRepository} from '../repositories';

export class PostPostCommentController {
  constructor(
    @repository(PostRepository) protected postRepository: PostRepository,
  ) { }

  @get('/posts/{id}/postComments', {
    responses: {
      '200': {
        description: 'Array of Post has many PostComment',
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
    return this.postRepository.postComments(id).find(filter);
  }

  @post('/posts/{id}/postComments', {
    responses: {
      '200': {
        description: 'Post model instance',
        content: {'application/json': {schema: getModelSchemaRef(PostComment)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Post.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PostComment, {
            title: 'NewPostCommentInPost',
            exclude: ['id'],
            optional: ['postId']
          }),
        },
      },
    }) postComment: Omit<PostComment, 'id'>,
  ): Promise<PostComment> {
    return this.postRepository.postComments(id).create(postComment);
  }

  @patch('/posts/{id}/postComments', {
    responses: {
      '200': {
        description: 'Post.PostComment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PostComment, {partial: true}),
        },
      },
    })
    postComment: Partial<PostComment>,
    @param.query.object('where', getWhereSchemaFor(PostComment)) where?: Where<PostComment>,
  ): Promise<Count> {
    return this.postRepository.postComments(id).patch(postComment, where);
  }

  @del('/posts/{id}/postComments', {
    responses: {
      '200': {
        description: 'Post.PostComment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(PostComment)) where?: Where<PostComment>,
  ): Promise<Count> {
    return this.postRepository.postComments(id).delete(where);
  }
}
