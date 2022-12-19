import {Entity, model, property} from '@loopback/repository';

@model({settings: {description: 'Links liked projects to users'}})
export class LikedProject extends Entity {
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
  projectId: number;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  constructor(data?: Partial<LikedProject>) {
    super(data);
  }
}

export interface LikedProjectRelations {
  // describe navigational properties here
}

export type LikedProjectWithRelations = LikedProject & LikedProjectRelations;
