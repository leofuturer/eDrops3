import { model, property, belongsTo, Entity } from '@loopback/repository';
import { User } from './user.model';

@model({
  settings: {
    description: 'Additional admin information',
    forceId: false,
    scope: {
      include: ['user'],
    }
  }
})
export class Admin extends Entity {
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
  phoneNumber?: string;

  @belongsTo(() => User)
  userId?: string;

  constructor(data?: Partial<Admin>) {
    super(data);
  }
}

export interface AdminRelations {
  // describe navigational properties here
}

export type AdminWithRelations = Admin & AdminRelations;
