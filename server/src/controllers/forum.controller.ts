import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Forum} from '../models';
import {ForumRepository} from '../repositories';

export class ForumController {
  constructor(
    @repository(ForumRepository)
    public forumRepository : ForumRepository,
  ) {}

  @post('/forums')
  @response(200, {
    description: 'Forum model instance',
    content: {'application/json': {schema: getModelSchemaRef(Forum)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Forum, {
            title: 'NewForum',
            exclude: ['id'],
          }),
        },
      },
    })
    forum: Omit<Forum, 'id'>,
  ): Promise<Forum> {
    return this.forumRepository.create(forum);
  }

  @get('/forums/count')
  @response(200, {
    description: 'Forum model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Forum) where?: Where<Forum>,
  ): Promise<Count> {
    return this.forumRepository.count(where);
  }

  @get('/forums')
  @response(200, {
    description: 'Array of Forum model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Forum, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Forum) filter?: Filter<Forum>,
  ): Promise<Forum[]> {
    return this.forumRepository.find(filter);
  }

  @patch('/forums')
  @response(200, {
    description: 'Forum PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Forum, {partial: true}),
        },
      },
    })
    forum: Forum,
    @param.where(Forum) where?: Where<Forum>,
  ): Promise<Count> {
    return this.forumRepository.updateAll(forum, where);
  }

  @get('/forums/{id}')
  @response(200, {
    description: 'Forum model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Forum, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Forum, {exclude: 'where'}) filter?: FilterExcludingWhere<Forum>
  ): Promise<Forum> {
    return this.forumRepository.findById(id, filter);
  }

  @patch('/forums/{id}')
  @response(204, {
    description: 'Forum PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Forum, {partial: true}),
        },
      },
    })
    forum: Forum,
  ): Promise<void> {
    await this.forumRepository.updateById(id, forum);
  }

  @put('/forums/{id}')
  @response(204, {
    description: 'Forum PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() forum: Forum,
  ): Promise<void> {
    await this.forumRepository.replaceById(id, forum);
  }

  @del('/forums/{id}')
  @response(204, {
    description: 'Forum DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.forumRepository.deleteById(id);
  }
}
