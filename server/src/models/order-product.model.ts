import {model, property} from '@loopback/repository';
import {orderItemBase} from '.';

@model({
  settings: {
    strict: false,
    plural: 'orderProducts',
    remoting: {
      sharedMethods: {
        '*': false,
        deleteById: true,
        'prototype.patchAttributes': true,
        'prototype.replaceById': true
      }
    }
  }
})
export class OrderProduct extends orderItemBase {
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<OrderProduct>) {
    super(data);
  }
}

export interface OrderProductRelations {
  // describe navigational properties here
}

export type OrderProductWithRelations = OrderProduct & OrderProductRelations;
