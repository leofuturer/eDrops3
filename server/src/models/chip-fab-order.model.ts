import {model, property} from '@loopback/repository';
import {OrderChip} from '.';

@model({settings: {strict: false}})
export class ChipFabOrder extends OrderChip {
  @property({
    type: 'string',
  })
  customerpName?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<OrderChip>) {
    super(data);
  }
}

export interface ChipFabOrderRelations {
  // describe navigational properties here
}

export type ChipFabOrderWithRelations = ChipFabOrder & ChipFabOrderRelations;
