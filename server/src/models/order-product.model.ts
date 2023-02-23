import {model, property} from '@loopback/repository';
import {OrderItem} from './order-item.model';

// @model({
//   settings: {
//     plural: 'orderProducts',
//     remoting: {
//       sharedMethods: {
//         '*': false,
//         deleteById: true,
//         'prototype.patchAttributes': true,
//         'prototype.replaceById': true,
//       },
//     },
//   },
// })
@model({settings: {description: 'Product order information'}})
export class OrderProduct extends OrderItem {
  // @property({
  //   type: 'number',
  // })
  // orderId?: number;
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
