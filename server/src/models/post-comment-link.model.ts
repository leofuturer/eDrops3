import {Entity, model, property} from '@loopback/repository';

@model({settings: {description: 'Link parent and child comments for posts'}})
export class PostCommentLink extends Entity {
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

  constructor(data?: Partial<PostCommentLink>) {
    super(data);
  }
}

export interface PostCommentLinkRelations {
  // describe navigational properties here
}

export type PostCommentLinkWithRelations = PostCommentLink & PostCommentLinkRelations;
