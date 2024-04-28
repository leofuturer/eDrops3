import {Entity, model, property} from '@loopback/repository';

@model({settings: {description: 'Links liked comments to users'}})
export class LikedComment extends Entity {
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
  commentId: number;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  constructor(data?: Partial<LikedComment>) {
    super(data);
  }
}

export interface LikedCommentRelations {
  // describe navigational properties here
}

export type LikedCommentWithRelations = LikedComment & LikedCommentRelations;