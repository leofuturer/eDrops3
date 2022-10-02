import {Entity, model, property, hasMany} from '@loopback/repository';
import {PostCommentLink} from './post-comment-link.model';

@model({settings: {description: 'Post comments', forceId: false}})
export class PostComment extends Entity {
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
    type: 'number',
  })
  postId?: number;

  @property({
    type: 'boolean',
    required: true,
    description: 'Whether the comment is top-level or not',
  })
  top: boolean;

  @hasMany(() => PostComment, {
    through: {model: () => PostCommentLink, keyFrom: 'parentId', keyTo: 'childId'},
  })
  postComments: PostComment[];

  constructor(data?: Partial<PostComment>) {
    super(data);
  }
}

export interface PostCommentRelations {
  // describe navigational properties here
}

export type PostCommentWithRelations = PostComment & PostCommentRelations;
