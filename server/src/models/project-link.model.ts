import {Entity, model, property} from '@loopback/repository';

@model()
export class ProjectLink extends Entity {
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
  link: string;

  constructor(data?: Partial<ProjectLink>) {
    super(data);
  }
}

export interface ProjectLinkRelations {
  // describe navigational properties here
}

export type ProjectLinkWithRelations = ProjectLink & ProjectLinkRelations;
