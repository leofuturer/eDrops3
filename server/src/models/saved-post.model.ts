import {Entity, model, property} from '@loopback/repository';

@model()
export class SavedPost extends Entity {
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


  constructor(data?: Partial<SavedPost>) {
    super(data);
  }
}

export interface SavedPostRelations {
  // describe navigational properties here
}

export type SavedPostWithRelations = SavedPost & SavedPostRelations;
