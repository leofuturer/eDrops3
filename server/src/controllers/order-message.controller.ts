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
import {OrderMessage} from '../models';
import {OrderMessageRepository} from '../repositories';
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const Pusher = require('pusher');
const pusher = new Pusher({
  appId: process.env.APP_PUSHER_API_ID,
  key: process.env.APP_PUSHER_API_KEY,
  secret:  process.env.APP_PUSHER_API_SECRET,
  cluster: process.env.APP_PUSHER_API_CLUSTER,
  useTLS: true,
});

export class OrderMessageController {
  constructor(
    @repository(OrderMessageRepository)
    public orderMessageRepository : OrderMessageRepository,
  ) {}

  @post('/orderMessages')
  @response(200, {
    description: 'OrderMessage model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrderMessage)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderMessage, {
            title: 'NewOrderMessage',
            
          }),
        },
      },
    })
    orderMessage: Omit<OrderMessage, 'id'>,
  ): Promise<OrderMessage> {
    const newMsgEntry = {
      message: orderMessage.message,
      userConvId: orderMessage.userConvId,
      date: orderMessage.messageDate,
    };
    pusher.trigger(`chat-${orderMessage.orderId}`, 'new-message', newMsgEntry);
    return this.orderMessageRepository.create(orderMessage);
  }

  @get('/orderMessages/count')
  @response(200, {
    description: 'OrderMessage model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(OrderMessage) where?: Where<OrderMessage>,
  ): Promise<Count> {
    return this.orderMessageRepository.count(where);
  }

  @get('/orderMessages')
  @response(200, {
    description: 'Array of OrderMessage model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(OrderMessage, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(OrderMessage) filter?: Filter<OrderMessage>,
  ): Promise<OrderMessage[]> {
    return this.orderMessageRepository.find(filter);
  }

  @patch('/orderMessages')
  @response(200, {
    description: 'OrderMessage PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderMessage, {partial: true}),
        },
      },
    })
    orderMessage: OrderMessage,
    @param.where(OrderMessage) where?: Where<OrderMessage>,
  ): Promise<Count> {
    return this.orderMessageRepository.updateAll(orderMessage, where);
  }

  @get('/orderMessages/{id}')
  @response(200, {
    description: 'OrderMessage model instance',
    content: {
      'application/json': {
        schema: {
          type: 'array',
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<OrderMessage[]> {
    return this.orderMessageRepository.find({where: {orderId: id}});
  }

  @patch('/orderMessages/{id}')
  @response(204, {
    description: 'OrderMessage PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderMessage, {partial: true}),
        },
      },
    })
    orderMessage: OrderMessage,
  ): Promise<void> {
    await this.orderMessageRepository.updateById(id, orderMessage);
  }

  @put('/orderMessages/{id}')
  @response(204, {
    description: 'OrderMessage PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() orderMessage: OrderMessage,
  ): Promise<void> {
    await this.orderMessageRepository.replaceById(id, orderMessage);
  }

  @del('/orderMessages/{id}')
  @response(204, {
    description: 'OrderMessage DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.orderMessageRepository.deleteById(id);
  }
}
