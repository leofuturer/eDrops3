import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false, validateUpsert: true, idInjection: true}})
export class CustomerAddress extends Entity {
  @property({
    type: 'number',
    id: 1,
    generated: true,
    updateOnly: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  street: string;

  @property({
    type: 'string',
    default: ,
  })
  streetLine2?: string;

  @property({
    type: 'string',
    required: true,
  })
  city: string;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'string',
    required: true,
  })
  country: string;

  @property({
    type: 'string',
    required: true,
  })
  zipCode: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isDefault: boolean;

  @property({
    type: 'number',
  })
  customerId?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<CustomerAddress>) {
    super(data);
  }
}

export interface CustomerAddressRelations {
  // describe navigational properties here
}

export type CustomerAddressWithRelations = CustomerAddress & CustomerAddressRelations;
