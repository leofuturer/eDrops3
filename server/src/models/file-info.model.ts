import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    description: 'File information',
    scope: {where: {isDeleted: false}},
  },
})
export class FileInfo extends Entity {
  @property({
    type: 'string',
    id: 1,
    defaultFn: 'uuidv4',
    limit: 36,
  })
  id?: string;

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
  uploader: string;

  @property({
    type: 'string',
    required: true,
  })
  fileSize: string;

  @property({
    type: 'boolean',
    required: true,
    description: 'Soft delete for files',
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
    default: false,
  })
  isPublic: boolean;

  @property({
    type: 'string',
    required: true,
    default: 'mm',
  })
  unit: string;

  @property({
    type: 'string',
  })
  customerId?: string;

  constructor(data?: Partial<FileInfo>) {
    super(data);
  }
}

export interface FileInfoRelations {
  // describe navigational properties here
}

export type FileInfoWithRelations = FileInfo & FileInfoRelations;
