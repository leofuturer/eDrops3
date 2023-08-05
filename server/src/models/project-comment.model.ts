import {Entity, model, property, hasMany} from '@loopback/repository';
import {ProjectCommentLink} from './project-comment-link.model';

@model({settings: {description: 'Project comments', forceId: false}})
export class ProjectComment extends Entity {
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
  projectId?: number;

  @property({
    type: 'boolean',
    required: true,
    description: 'Whether the comment is top-level or not',
  })
  top: boolean;

  @hasMany(() => ProjectComment, {
    through: {model: () => ProjectCommentLink, keyFrom: 'parentId', keyTo: 'childId'},
  })
  projectComments?: ProjectComment[];

  constructor(data?: Partial<ProjectComment>) {
    super(data);
  }
}

export interface ProjectCommentRelations {
  // describe navigational properties here
}

export type ProjectCommentWithRelations = ProjectComment & ProjectCommentRelations;
