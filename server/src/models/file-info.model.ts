import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: false,
    validateUpsert: true,
    idInjection: true,
    remoting: {sharedMethods: {'*': false, find: true}}
  }
})
export class FileInfo extends Entity {
  @property({
    type: 'number',
    id: 1,
    generated: true,
    updateOnly: true,
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
    default: mm,
  })
  unit: string;

  @property({
    type: 'number',
  })
  customerId?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<FileInfo>) {
    super(data);
  }
}

export interface FileInfoRelations {
  // describe navigational properties here
}

export type FileInfoWithRelations = FileInfo & FileInfoRelations;
