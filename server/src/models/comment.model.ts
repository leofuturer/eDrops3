import {Entity, model, property, hasMany} from '@loopback/repository';
import {CommentLink} from './comment-link.model';

@model({settings: {description: 'Post comments', forceId: false}})
export class Comment extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  author: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
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
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  parentType: string;

  @property({
    type: 'number',
  })
  parentId?: number;

  @property({
    type: 'boolean',
    required: true,
    description: 'Whether the comment is top-level or not',
  })
  top: boolean;

  @hasMany(() => Comment, {
    through: {model: () => CommentLink, keyFrom: 'parentCommentId', keyTo: 'childCommentId'},
  })
  comments?: Comment[];

  constructor(data?: Partial<Comment>) {
    super(data);
  }
}

export interface CommentRelations {
  // describe navigational properties here
}

export type CommentWithRelations = Comment & CommentRelations;
