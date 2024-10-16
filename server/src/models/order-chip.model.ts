import {model, property, belongsTo} from '@loopback/repository';
import {OrderItem} from './order-item.model';
import {FileInfo} from './file-info.model';
import {FoundryWorker} from './foundry-worker.model';

// @model({
//   settings: {
//     plural: 'orderChips',
//     remoting: {
//       sharedMethods: {
//         '*': false,
//         deleteById: true,
//         'prototype.patchAttributes': true,
//         'prototype.replaceById': true
//       }
//     },
//   }
// })
@model({settings: {description: 'Chip order information'}})
export class OrderChip extends OrderItem {
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

  @belongsTo(() => FileInfo)
  fileInfoId: string;

  @belongsTo(() => FoundryWorker)
  workerId: string;

  @property({
    type: 'string',
  })
  customerName?: string;

  @property({
    type: 'string',
  })
  workerName?: string;

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
