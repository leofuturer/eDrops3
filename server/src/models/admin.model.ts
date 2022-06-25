import {model, property} from '@loopback/repository';
import {User} from '.';

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
        credsTaken: true,
        login: true,
        logout: true,
        resetPassword: true,
        setPassword: true,
        changePassword: true,
        getApiToken: true,
        returnAllItems: true,
        returnOneItem: true,
        downloadFile: true,
        getChipOrders: true
      }
    }
  }
})
export class Admin extends User {
  @property({
    type: 'string',
  })
  phoneNumber?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Admin>) {
    super(data);
  }
}

export interface AdminRelations {
  // describe navigational properties here
}

export type AdminWithRelations = Admin & AdminRelations;
