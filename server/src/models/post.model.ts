import {Entity, model, property, hasMany} from '@loopback/repository';
import {PostComment} from './post-comment.model';

@model({
  settings: {
    description: 'Community site posts',
    forceId: false,
  },
})
export class Post extends Entity {
  @property({
    type: 'number',
    id: 1,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    mysql: {
      index: {
        kind: 'FULLTEXT',
      },
    },
  })
  author: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      index: {
        kind: 'FULLTEXT',
      },
    },
  })
  title: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      index: {
        kind: 'FULLTEXT',
      },
      dataType: 'LONGTEXT',
    },
  })
  content: string;

  @property({
    type: 'date',
    required: true,
  })
  datetime: Date;

  @property({
    type: 'number',
    required: true,
  })
  likes: number;

  @property({
    type: 'number',
    required: true,
  })
  comments: number;

  @property({
    type: 'string',
    // required: true,
  })
  userId: string;

  @hasMany(() => PostComment)
  postComments: PostComment[];

  constructor(data?: Partial<Post>) {
    super(data);
  }
}

export interface PostRelations {
  // describe navigational properties here
}

export type PostWithRelations = Post & PostRelations;
