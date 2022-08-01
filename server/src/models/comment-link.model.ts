import {Entity, model, property} from '@loopback/repository';

@model()
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
  parentId: number;

  @property({
    type: 'number',
    required: true,
  })
  childId: number;


  constructor(data?: Partial<CommentLink>) {
    super(data);
  }
}

export interface CommentLinkRelations {
  // describe navigational properties here
}

export type CommentLinkWithRelations = CommentLink & CommentLinkRelations;
