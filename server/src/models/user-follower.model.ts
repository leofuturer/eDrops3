import {Entity, model, property} from '@loopback/repository';

@model({settings: {description: 'Links users to followers'}})
export class UserFollower extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  followerId: string;


  constructor(data?: Partial<UserFollower>) {
    super(data);
  }
}

export interface UserFollowerRelations {
  // describe navigational properties here
}

export type UserFollowerWithRelations = UserFollower & UserFollowerRelations;
