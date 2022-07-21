import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    allowExtendedOperators: true
  }
})
export class Project extends Entity {
  @property({
    type: 'string',
    required: true,
    mysql: {
      index: {
        kind: 'FULLTEXT'
      }
    },
  })
  title: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      index: {
        kind: 'FULLTEXT'
      }
    },
  })
  author: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      index: {
        kind: 'FULLTEXT'
      },
      dataType: 'LONGTEXT'
    },
  })
  content: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'date',
    required: true,
  })
  datetime: string;

  @property({
    type: 'number',
    required: true,
  })
  likes: number

  @property({
    type: 'number',
    required: false,
  })
  dislikes: number;

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
