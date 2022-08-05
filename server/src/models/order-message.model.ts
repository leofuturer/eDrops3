import {Entity, model, property} from '@loopback/repository';

@model({
   settings: {
      validateUpsert: true,
      plural: 'orderMessages',
      idInjection: true,
      remoting: {
        sharedMethods: {
            '*': false,
            deleteById: true,
            'prototype.patchAttributes': true,
            'prototype.replaceById': true,
            addOrderMessage: true,
            findById: true,
            find: true,
        }
      },
      mysql: {table: 'orderMessage'},
   },
})

export class OrderMessage extends Entity {
    @property({
      type: 'number',
      id: 1,
      generated: true,
      updateOnly: true,
      })
    id?: number;

    @property({
      type: 'object',
      required: false,
      description: 'Array of messages associated with the order'
      })
    message_arr: object;

    @property({
      type: 'string',
      required: true,
      description: 'ID of the order that the messages are associated with'
      })
    orderId: string;

    [prop: string]: any;

    constructor(data?: Partial<OrderMessage>) {
    super(data);
  }
}

export interface OrderMessageRelations {
    // describe navigational properties here
  }
  
export type OrderMessageWithRelations = OrderMessage & OrderMessageRelations;