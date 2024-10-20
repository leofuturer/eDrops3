import {Entity, model, property, hasMany} from '@loopback/repository';
import { Comment } from './comment.model';
import {ProjectFile} from './project-file.model';
import {ProjectLink} from './project-link.model';

@model({
  settings: {
    description: 'Community site projects',
    forceId: false,
  }
})
export class Project extends Entity {
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
    type: 'date',
    required: true,
  })
  datetime: Date;

  @property({
    type: 'number',
    required: true,
  })
  likes: number

  @property({
    type: 'number',
    required: true,
  })
  comments: number;

  @property({
    type: 'string',
  })
  userId?: string;

  @hasMany(() => ProjectFile)
  projectFiles?: ProjectFile[];

  @hasMany(() => ProjectLink)
  projectLinks?: ProjectLink[];

  @hasMany(() => Comment, {keyTo: "parentId"})
  projectComments?: Comment[];

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
