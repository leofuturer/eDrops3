import {Entity, model, property} from '@loopback/repository';

@model()
export class Forum extends Entity {
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
    type: 'string',
    required: true,
  })
  author: string;

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
      },
      dataType: 'LONGTEXT'
    },
  })
  content: string;

  @property({
    type: 'date',
    required: true,
  })
  datetime: string;

  @property({
    type: 'number',
    required: true,
  })
  likes: number;


  constructor(data?: Partial<Forum>) {
    super(data);
  }
}

export interface ForumRelations {
  // describe navigational properties here
}

export type ForumWithRelations = Forum & ForumRelations;
