import {Entity, model, property} from '@loopback/repository';

@model()
export class Post extends Entity {
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

  constructor(data?: Partial<Post>) {
    super(data);
  }
}

export interface PostRelations {
  // describe navigational properties here
}

export type PostWithRelations = Post & PostRelations;
