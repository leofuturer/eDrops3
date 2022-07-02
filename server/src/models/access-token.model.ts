import {Entity, model, property} from '@loopback/repository';

@model({settings: {forceId: false, mysql: {table: 'AccessToken'}}})
export class AccessToken extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'number',
    ttl: true,
    default: 1209600,
    description: 'time to live in seconds (2 weeks by default)',
  })
  ttl?: number;

  @property({
    type: 'array',
    description: 'Array of scopes granted to this access token.',
    itemType: 'string',
  })
  scopes?: string[];

  @property({
    type: 'date',
    defaultFn: Date.now(),
  })
  created?: string;

  @property({
    type: 'string',
  })
  userId?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<AccessToken>) {
    super(data);
  }
}

export interface AccessTokenRelations {
  // describe navigational properties here
}

export type AccessTokenWithRelations = AccessToken & AccessTokenRelations;
