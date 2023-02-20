import {Entity, model, property} from '@loopback/repository';

@model({settings: {description: 'User profile information'}})
export class UserProfile extends Entity {
  @property({
    type: 'string',
    id: 1,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
  })
  nickname?: string;

  @property({
    type: 'string',
  })
  bio?: string;

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<UserProfile>) {
    super(data);
  }
}

export interface UserProfileRelations {
  // describe navigational properties here
}

export type UserProfileWithRelations = UserProfile & UserProfileRelations;
