import {model, property, hasMany, belongsTo, Entity} from '@loopback/repository';
import {User} from '.';
import {OrderChip} from './order-chip.model';

@model({
  settings: {
    validateUpsert: true,
    idInjection: true,
    remoting: {
      sharedMethods: {
        '*': false,
        create: true,
        findById: true,
        deleteById: true,
        'prototype.patchAttributes': true,
        'prototype.replaceById': true,
        find: true,
        login: true,
        logout: true,
        resetPassword: true,
        setPassword: true,
        changePassword: true,
        'prototype.downloadFile': true,
        'prototype.getChipOrders': true,
        getWorkerID: true
      }
    },
    mysql: {table: 'foundryWorker'}
  }
})
export class FoundryWorker extends Entity {
  @property({
    type: 'number',
    id: 1,
    generated: true,
    updateOnly: true,
  })
  id?: number;
  
  @property({
    type: 'string',
  })
  street?: string;

  @property({
    type: 'string',
  })
  streetLine2?: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  phoneNumber: string;

  @property({
    type: 'string',
  })
  country?: string;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'string',
  })
  city?: string;

  @property({
    type: 'string',
  })
  zipCode?: string;

  @property({
    type: 'string',
    required: true,
  })
  affiliation: string;

  @hasMany(() => OrderChip, {keyTo: 'workerId'})
  orderChips: OrderChip[];

  @belongsTo(() => User)
  userId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<FoundryWorker>) {
    super(data);
  }
}

export interface FoundryWorkerRelations {
  // describe navigational properties here
}

export type FoundryWorkerWithRelations = FoundryWorker & FoundryWorkerRelations;
