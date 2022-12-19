import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Project} from './project.model';

@model({
  settings: {
    description: 'File information',
    scope: {where: {isDeleted: false}},
  },
})
export class ProjectFile extends Entity {
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
  uploadTime: string;

  @property({
    type: 'string',
    required: true,
  })
  fileName: string;

  @property({
    type: 'string',
    required: true,
  })
  containerFileName: string;
  
  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  uploader: string;

  @property({
    type: 'string',
    required: true,
  })
  fileSize: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isDeleted: boolean;

  @property({
    type: 'string',
    required: true,
  })
  container: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isPublic: boolean;

  @property({
    type: 'string',
    required: true,
  })
  fileType: 'attachment' | 'image' | 'video';

  @belongsTo(() => Project)
  projectId: number;

  constructor(data?: Partial<ProjectFile>) {
    super(data);
  }
}

export interface ProjectFileRelations {
  // describe navigational properties here
}

export type ProjectFileWithRelations = ProjectFile & ProjectFileRelations;
