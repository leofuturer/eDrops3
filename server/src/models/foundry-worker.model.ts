import {
  belongsTo,
  Entity, hasMany, model,
  property
} from '@loopback/repository';
import { OrderChip } from './order-chip.model';
import { User } from './user.model';

@model({
  settings: {
    description: 'Additional foundry worker information',
    forceId: false,
  },
})
export class FoundryWorker extends Entity {
  @property({
    type: 'string',
    id: 1,
    defaultFn: 'uuidv4',
    limit: 36,
  })
  id?: string;

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
  orderChips?: OrderChip[];

  @belongsTo(() => User)
  userId?: string;

  constructor(data?: Partial<FoundryWorker>) {
    super(data);
  }
}

export interface FoundryWorkerRelations {
  // describe navigational properties here
}

export type FoundryWorkerWithRelations = FoundryWorker & FoundryWorkerRelations;
