import {model, property} from '@loopback/repository';
import {User} from '.';

@model({
  settings: {
    strict: false,
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
        changePassword: true
      }
    }
  }
})
export class UserBase extends User {
  @property({
    type: 'string',
    required: true,
    default: 'customer',
  })
  userType: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserBase>) {
    super(data);
  }
}

export interface UserBaseRelations {
  // describe navigational properties here
}

export type UserBaseWithRelations = UserBase & UserBaseRelations;
