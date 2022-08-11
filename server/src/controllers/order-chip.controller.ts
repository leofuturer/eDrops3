import { inject, intercept } from '@loopback/core';
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
import { OrderChipUpdateInterceptor } from '../interceptors';
import { OrderChip } from '../models';
import { OrderChipRepository } from '../repositories';

export class OrderChipController {
  constructor(
    @repository(OrderChipRepository)
    public orderChipRepository : OrderChipRepository,
  ) {}

  @post('/orderChips')
  @response(200, {
    description: 'OrderChip model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrderChip)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderChip, {
            title: 'NewOrderChip',
            exclude: ['id'],
          }),
        },
      },
    })
    orderChip: Omit<OrderChip, 'id'>,
  ): Promise<OrderChip> {
    return this.orderChipRepository.create(orderChip);
  }

  @get('/orderChips/count')
  @response(200, {
    description: 'OrderChip model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(OrderChip) where?: Where<OrderChip>,
  ): Promise<Count> {
    return this.orderChipRepository.count(where);
  }

  @get('/orderChips')
  @response(200, {
    description: 'Array of OrderChip model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(OrderChip, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(OrderChip) filter?: Filter<OrderChip>,
  ): Promise<OrderChip[]> {
    return this.orderChipRepository.find(filter);
  }

  @patch('/orderChips')
  @response(200, {
    description: 'OrderChip PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderChip, {partial: true}),
        },
      },
    })
    orderChip: OrderChip,
    @param.where(OrderChip) where?: Where<OrderChip>,
  ): Promise<Count> {
    return this.orderChipRepository.updateAll(orderChip, where);
  }

  @get('/orderChips/{id}')
  @response(200, {
    description: 'OrderChip model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(OrderChip, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(OrderChip, {exclude: 'where'}) filter?: FilterExcludingWhere<OrderChip>
  ): Promise<OrderChip> {
    return this.orderChipRepository.findById(id, filter);
  }

  @intercept(OrderChipUpdateInterceptor.BINDING_KEY)
  @patch('/orderChips/{id}')
  @response(204, {
    description: 'OrderChip PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderChip, {partial: true}),
        },
      },
    })
    orderChip: OrderChip,
  ): Promise<void> {
    await this.orderChipRepository.updateById(id, orderChip);
  }

  @put('/orderChips/{id}')
  @response(204, {
    description: 'OrderChip PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() orderChip: OrderChip,
  ): Promise<void> {
    await this.orderChipRepository.replaceById(id, orderChip);
  }

  @del('/orderChips/{id}')
  @response(204, {
    description: 'OrderChip DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.orderChipRepository.deleteById(id);
  }
}
