import {
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors, param, post, Request, requestBody,
  response, RestBindings
} from '@loopback/rest';
import { OrderMessage } from '../models';
import { OrderMessageRepository } from '../repositories';

export class OrderMessageController {
    constructor(
        @repository(OrderMessageRepository)
        public orderMessageRepository: OrderMessageRepository,
    ) {}
    
    @post('/orderMessages/{id}/addOrderMessage')
    @response(200, {
        description: 'Append message to message array associated with order',
        content: {
            'application/json': {
                schema: {type: 'object'},
            },
        },
    })
    async addMessage(
        @requestBody({
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                }
            },
        },
        })
        message: Omit<OrderMessage, 'id'>,
    ): Promise<void> {
        return this.orderMessageRepository.addOrderMessage(message);
    }

    @get('/orderMessages/{id}')
    @response(200, {
        description: 'OrderMessage model instance',
        content: {
            'application/json': {
                schema: getModelSchemaRef(OrderMessage)
            },
        },
    })
    async findById(
        @param.path.number('id') id: number,
        @param.filter(OrderMessage, {exclude: 'where'})
        filter?: FilterExcludingWhere<OrderMessage>,
    ): Promise<OrderMessage> {
        return this.orderMessageRepository.findById(id, filter)
    }
}
