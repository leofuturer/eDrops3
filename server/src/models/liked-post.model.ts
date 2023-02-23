import {Entity, model, property} from '@loopback/repository';

@model({settings: {description: 'Links liked posts to users'}})
export class LikedPost extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  postId: number;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  constructor(data?: Partial<LikedPost>) {
    super(data);
  }
}

export interface LikedPostRelations {
  // describe navigational properties here
}

export type LikedPostWithRelations = LikedPost & LikedPostRelations;
