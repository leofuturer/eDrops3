<<<<<<< HEAD
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {OrderMessage, OrderMessageRelations} from '../models';
=======
import { inject } from '@loopback/core';
import { 
    AnyObject,
    DefaultCrudRepository
 } from '@loopback/repository';
import { MysqlDsDataSource } from '../datasources';
import { OrderMessage, OrderMessageRelations } from '../models';
import {HttpErrors} from '@loopback/rest';
import Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.APP_PUSHER_API_ID,
  key: process.env.APP_PUSHER_API_KEY,
  secret:  process.env.APP_PUSHER_API_SECRET,
  cluster: process.env.APP_PUSHER_API_CLUSTER,
  useTLS: true,
});
>>>>>>> Initial message model system

export class OrderMessageRepository extends DefaultCrudRepository<
  OrderMessage,
  typeof OrderMessage.prototype.id,
  OrderMessageRelations
> {
<<<<<<< HEAD
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(OrderMessage, dataSource);
  }
}
=======
    constructor(
        @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    ) {
        super(OrderMessage, dataSource);
    }

    async addOrderMessage( body: AnyObject
    ): Promise<void> {
        const messages = await this.findById(orderId);
        if (!messages){
            const newMsgEntry = {
                message: body.msg,
                user_id: body.user_id,
            }
            const orderMessage = {
            orderId: body.orderId,
            message_arr: [newMsgEntry]
            }
            await this.create(orderMessage).then(() => {
                pusher.trigger(`chat-${body.orderId}`, 'new-message', newMsgEntry);
            })
            .catch(err => {
                throw new HttpErrors.InternalServerError(err.message);
            });
        }
        else{
            const newMsgEntry = {
                message: body.msg,
                user_id: body.user_id,
            }
            var mess = messages.message_arr;
            mess.push(newMsgEntry);
            this.updateById(body.orderId, {
                message_arr: mess,
            });
            pusher.trigger(`chat-${body.orderId}`, 'new-message', newMsgEntry);
        }
       
    }
}
>>>>>>> Initial message model system
