import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    caseSensitiveEmail: true,
    hidden: ['password', 'verificationToken'],
    maxTTL: 31556926,
    ttl: 1209600,
    mysql: {table: 'User'}
  }
})
export class User extends Entity {
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
  realm?: string;

  @property({
    type: 'string',
  })
  username?: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;
  // @hasOne(() => UserCredentials)
  // userCredentials: UserCredentials;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'boolean',
  })
  emailVerified?: boolean;

  @property({
    type: 'string',
  })
  verificationToken?: string;

  @property({
    type: 'date',
  })
  verificationTokenExpires?: Date;

  // Define well-known properties here

  @property({
    type: 'string',
    required: false,
    default: 'customer',
  })
  userType?: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;