import {Entity, model, property} from '@loopback/repository';

@model()
export class LikedComment extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true
  })
  userId: string;

  @property({
    type: 'number',
    required: true
  })
  commentId: number;

  constructor(data?: Partial<LikedComment>) {
    super(data);
  }
}

export interface LikedCommentRelations {
  // describe navigational properties here
}

export type LikedCommentWithRelations = LikedComment & LikedCommentRelations;
