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

  @intercept(OrderChipUpdateInterceptor.BINDING_KEY)
  @patch('/order-chips/{id}')
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

  @put('/order-chips/{id}')
  @response(204, {
    description: 'OrderChip PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() orderChip: OrderChip,
  ): Promise<void> {
    await this.orderChipRepository.replaceById(id, orderChip);
  }

  @del('/order-chips/{id}')
  @response(204, {
    description: 'OrderChip DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.orderChipRepository.deleteById(id);
  }
}
