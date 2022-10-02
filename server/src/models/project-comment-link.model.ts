import {Entity, model, property} from '@loopback/repository';

@model({settings: {description: 'Link parent and child comments for projects'}})
export class ProjectCommentLink extends Entity {
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

  constructor(data?: Partial<ProjectCommentLink>) {
    super(data);
  }
}

export interface ProjectCommentLinkRelations {
  // describe navigational properties here
}

export type ProjectCommentLinkWithRelations = ProjectCommentLink & ProjectCommentLinkRelations;
