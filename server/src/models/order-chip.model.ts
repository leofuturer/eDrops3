import {model, property} from '@loopback/repository';
import {OrderItemBase} from '.';

@model({
  settings: {
    plural: 'orderChips',
    remoting: {
      sharedMethods: {
        '*': false,
        deleteById: true,
        'prototype.patchAttributes': true,
        'prototype.replaceById': true
      }
    },
    mysql: {table: 'orderChip'}
  }
})
export class OrderChip extends OrderItemBase {
  @property({
    type: 'string',
    required: true,
  })
  process: string;

  @property({
    type: 'string',
    required: true,
  })
  coverPlate: string;

  @property({
    type: 'date',
    required: true,
  })
  lastUpdated: string;

  @property({
    type: 'string',
    required: true,
    default: 'Fabrication request received',
  })
  status: string;

  @property({
    type: 'number',
  })
  fileInfoId?: number;

  @property({
    type: 'number',
  })
  workerId?: number;

  // @property({
  //   type: 'number',
  // })
  // orderId?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<OrderChip>) {
    super(data);
  }
}

export interface OrderChipRelations {
  // describe navigational properties here
}

export type OrderChipWithRelations = OrderChip & OrderChipRelations;
