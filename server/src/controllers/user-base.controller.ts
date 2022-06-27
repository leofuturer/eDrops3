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
import {UserBase} from '../models';
import {UserBaseRepository} from '../repositories';

export class UserBaseController {
  constructor(
    @repository(UserBaseRepository)
    public userBaseRepository : UserBaseRepository,
  ) {}

  @post('/userBases')
  @response(200, {
    description: 'UserBase model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserBase)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserBase, {
            title: 'NewUserBase',
            exclude: ['id'],
          }),
        },
      },
    })
    userBase: Omit<UserBase, 'id'>,
  ): Promise<UserBase> {
    return this.userBaseRepository.create(userBase);
  }

  @get('/userBases/count')
  @response(200, {
    description: 'UserBase model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserBase) where?: Where<UserBase>,
  ): Promise<Count> {
    return this.userBaseRepository.count(where);
  }

  @get('/userBases')
  @response(200, {
    description: 'Array of UserBase model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserBase, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserBase) filter?: Filter<UserBase>,
  ): Promise<UserBase[]> {
    return this.userBaseRepository.find(filter);
  }

  @patch('/userBases')
  @response(200, {
    description: 'UserBase PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserBase, {partial: true}),
        },
      },
    })
    userBase: UserBase,
    @param.where(UserBase) where?: Where<UserBase>,
  ): Promise<Count> {
    return this.userBaseRepository.updateAll(userBase, where);
  }

  @get('/userBases/{id}')
  @response(200, {
    description: 'UserBase model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserBase, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UserBase, {exclude: 'where'}) filter?: FilterExcludingWhere<UserBase>
  ): Promise<UserBase> {
    return this.userBaseRepository.findById(id, filter);
  }

  @patch('/userBases/{id}')
  @response(204, {
    description: 'UserBase PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserBase, {partial: true}),
        },
      },
    })
    userBase: UserBase,
  ): Promise<void> {
    await this.userBaseRepository.updateById(id, userBase);
  }

  @put('/userBases/{id}')
  @response(204, {
    description: 'UserBase PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userBase: UserBase,
  ): Promise<void> {
    await this.userBaseRepository.replaceById(id, userBase);
  }

  @del('/userBases/{id}')
  @response(204, {
    description: 'UserBase DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userBaseRepository.deleteById(id);
  }
}
