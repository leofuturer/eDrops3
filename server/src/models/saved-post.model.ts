import {Entity, model, property} from '@loopback/repository';

@model({settings: {description: 'Links saved posts to users'}})
export class SavedPost extends Entity {
  @property({
    type: 'number',
    id: 1,
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


  constructor(data?: Partial<SavedPost>) {
    super(data);
  }
}

export interface SavedPostRelations {
  // describe navigational properties here
}

export type SavedPostWithRelations = SavedPost & SavedPostRelations;
