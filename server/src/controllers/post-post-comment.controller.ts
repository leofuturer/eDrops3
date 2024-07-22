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
import {intercept} from '@loopback/core';
import {AuthorInterceptor} from '../interceptors';
import {Post, Comment} from '../models';
import {CommentRepository, PostRepository} from '../repositories';

export class PostPostCommentController {
  constructor(
    @repository(PostRepository) protected postRepository: PostRepository,
    @repository(CommentRepository)
    protected postComments: CommentRepository,
  ) {}

  @get('/posts/{id}/post-comments', {
    responses: {
      '200': {
        description: 'Array of Post has many PostComment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Comment>,
  ): Promise<Comment[]> {
    return this.postRepository.postComments(id).find({...filter, where: {top: true}});
  }

  @get('/posts/{id}/commentCount', {
    responses: {
      '200': {
        description: 'Number of PostComments for a Post',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comment)},
          },
        },
      },
    },
  })
  async commentCount(@param.path.number('id') id: number): Promise<Count> {
    return this.postComments.count({parentId: id});
  }

  @intercept(AuthorInterceptor.BINDING_KEY)
  @post('/posts/{id}/post-comments', {
    responses: {
      '200': {
        description: 'Post model instance',
        content: {'application/json': {schema: getModelSchemaRef(Comment)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Post.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comment, {
            title: 'NewPostCommentInPost',
            exclude: ['id'],
            optional: ['parentId'],
          }),
        },
      },
    })
    postComment: Omit<Comment, 'id'>,
  ): Promise<Comment> {
    return this.postRepository
      .postComments(id)
      .create(postComment)
      .then(comment => {
        this.postRepository.findById(id).then(post => {
          this.postRepository.updateById(id, {comments: post.comments + 1});
        });
        return comment;
      });
  }

  @patch('/posts/{id}/post-comments', {
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
          schema: getModelSchemaRef(Comment, {partial: true}),
        },
      },
    })
    postComment: Partial<Comment>,
    @param.query.object('where', getWhereSchemaFor(Comment))
    where?: Where<Comment>,
  ): Promise<Count> {
    return this.postRepository.postComments(id).patch(postComment, where);
  }

  @del('/posts/{id}/post-comments', {
    responses: {
      '200': {
        description: 'Post.PostComment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Comment))
    where?: Where<Comment>,
  ): Promise<Count> {
    return this.postRepository
      .postComments(id)
      .delete(where)
      .then(count => {
        this.postRepository.findById(id).then(post => {
          this.postRepository.updateById(id, {
            comments: post.comments - count.count,
          });
        });
        return count;
      });
  }
}
