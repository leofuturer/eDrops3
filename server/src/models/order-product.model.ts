import {model, property} from '@loopback/repository';
import {OrderItemBase} from './order-item-base.model';

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
export class OrderProduct extends OrderItemBase {
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
