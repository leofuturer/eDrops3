import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import { Post } from '../models';
import { PostRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { RestBindings, Request } from '@loopback/rest';
import { jwtDecode } from "jwt-decode";

@authenticate('jwt')
export class PostController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @repository(PostRepository)
    public postRepository : PostRepository,
  ) {}

  @post('/posts')
  @response(200, {
    description: 'Post model instance',
    content: {'application/json': {schema: getModelSchemaRef(Post)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {
            title: 'NewPost',
            exclude: ['id'],
          }),
        },
      },
    })
    post: Omit<Post, 'id'>,
  ): Promise<object> {
    const authHeader = this.request.headers["authorization"];
    if (!authHeader) {
      throw new HttpErrors.Unauthorized("Request header missing");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwtDecode<{"name": string, "id": string, "userType": string}>(token);
    if (!decoded.name || decoded.name!=post.author) {
      throw new HttpErrors.Unauthorized("User unauthorized");
    }
    this.postRepository.create(post);

    return {"jwt": token, "decoded": decoded}
  }

  @authenticate.skip()
  @get('/posts/count')
  @response(200, {
    description: 'Post model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Post) where?: Where<Post>,
  ): Promise<Count> {
    return this.postRepository.count(where);
  }

  @authenticate.skip()
  @get('/posts')
  @response(200, {
    description: 'Array of Post model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Post, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Post) filter?: Filter<Post>,
  ): Promise<Post[]> {
    return this.postRepository.find(filter);
  }

  @patch('/posts')
  @response(200, {
    description: 'Post PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {partial: true}),
        },
      },
    })
    post: Post,
    @param.where(Post) where?: Where<Post>,
  ): Promise<Count> {
    return this.postRepository.updateAll(post, where);
  }

  @authenticate.skip()
  @get('/posts/{id}')
  @response(200, {
    description: 'Post model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Post, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Post, {exclude: 'where'}) filter?: FilterExcludingWhere<Post>
  ): Promise<Post> {
    return this.postRepository.findById(id, filter);
  }

  @patch('/posts/{id}')
  @response(204, {
    description: 'Post PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {partial: true}),
        },
      },
    })
    post: Post,
  ): Promise<void> {
    await this.postRepository.updateById(id, post);
  }

  @put('/posts/{id}')
  @response(204, {
    description: 'Post PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() post: Post,
  ): Promise<void> {
    await this.postRepository.replaceById(id, post);
  }

  @del('/posts/{id}')
  @response(204, {
    description: 'Post DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.postRepository.deleteById(id);
  }

  @authenticate.skip()
  @get('/posts/featured')
  @response(200, {
    description: 'Featured posts',
  })
  async getFeaturedPosts(): Promise<Post[]> {
    return this.postRepository.getFeaturedPosts();
  }
}
