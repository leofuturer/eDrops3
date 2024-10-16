import {Entity, model, property} from '@loopback/repository';

@model({settings: {description: 'Link parent and child comments'}})
export class CommentLink extends Entity {
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
  parentCommentId: number;

  @property({
    type: 'number',
    required: true,
  })
  childCommentId: number;

  constructor(data?: Partial<CommentLink>) {
    super(data);
  }
}

export interface CommentLinkRelations {
  // describe navigational properties here
}

export type CommentLinkWithRelations = CommentLink & CommentLinkRelations;
