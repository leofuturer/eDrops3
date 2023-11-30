import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param,
  post,
  requestBody,
  response
} from '@loopback/rest';
import Pusher from 'pusher';
import { OrderMessage } from '../models';
import { OrderInfoRepository } from '../repositories';

const pusher = new Pusher({
  appId: process.env.APP_PUSHER_API_ID as string,
  key: process.env.APP_PUSHER_API_KEY as string,
  secret: process.env.APP_PUSHER_API_SECRET as string,
  cluster: process.env.APP_PUSHER_API_CLUSTER as string,
  useTLS: true,
});

export class OrderMessageController {
  constructor(
    @repository(OrderInfoRepository)
    public orderInfoRepository: OrderInfoRepository,
  ) { }

  @post('/orders/{id}/messages')
  @response(200, {
    description: 'OrderMessage model instance',
    content: { 'application/json': { schema: getModelSchemaRef(OrderMessage) } },
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
    @param.path.number('id') id: number,
  ): Promise<OrderMessage> {
    const newMsgEntry = {
      message: orderMessage.message,
      userId: orderMessage.userId,
      timestamp: orderMessage.timestamp,
    };
    return await this.orderInfoRepository.orderMessages(id).create(orderMessage).then(async (res) => {
      await pusher.trigger(`chat-${orderMessage.orderId}`, 'new-message', newMsgEntry)
      return res;
    });
  }

  @get('/orders/{id}/messages')
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
    return this.orderInfoRepository.orderMessages(id).find();
  }
}
