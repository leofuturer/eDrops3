import {Entity, model, property} from '@loopback/repository';

@model({settings: {description: 'Links saved projects to users'}})
export class SavedProject extends Entity {
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
  projectId: number;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;


  constructor(data?: Partial<SavedProject>) {
    super(data);
  }
}

export interface SavedProjectRelations {
  // describe navigational properties here
}

export type SavedProjectWithRelations = SavedProject & SavedProjectRelations;
