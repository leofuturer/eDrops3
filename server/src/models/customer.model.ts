import {model, property} from '@loopback/repository';
import {User} from '.';

@model({
  settings: {
    emailVerificationRequired: true,
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
        credsTaken: true,
        login: true,
        logout: true,
        changePassword: true,
        resendVerifyEmail: true,
        confirm: true,
        getApiToken: true,
        'prototype.deleteFile': true,
        'prototype.downloadFile': true,
        'prototype.uploadFile': true,
        'prototype.__get__customerFiles': true,
        'prototype.getCustomerCart': true,
        'prototype.__get__customerOrders': true,
        'prototype.__create__customerOrders': true,
        'prototype.getChipOrders': true,
        'prototype.__get__customerAddresses': true,
        'prototype.__create__customerAddresses': true,
        'prototype.__destroyById__customerAddresses': true,
        'prototype.__updateById__customerAddresses': true
      }
    },
    mysql: {table: 'customer'}
  }
})
export class Customer extends User {
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
  })
  phoneNumber?: string;

  @property({
    type: 'string',
    required: true,
    default: 'person',
  })
  userType: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
