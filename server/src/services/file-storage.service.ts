import {
  BindingKey,
    /* inject, */ BindingScope,
  ContextTags,
  Provider,
  config,
  injectable,
} from '@loopback/core';
import { RequestHandler } from 'express';
import multer from 'multer';

/*
 * Fix the service type. Possible options can be:
 * - import {FileStorage} from 'your-module';
 * - export type FileStorage = string;
 * - export interface FileStorage {}
 */
export type FileStorage = unknown;

/**
 * Binding key for the file upload service
 */
export const FILE_UPLOAD_SERVICE = BindingKey.create<RequestHandler>(
  'services.FileUpload',
);

/**
 * Binding key for the storage directory
 */
export const STORAGE_DIRECTORY = BindingKey.create<string>('storage.directory');

@injectable({
  scope: BindingScope.TRANSIENT,
  tags: {[ContextTags.KEY]: FILE_UPLOAD_SERVICE},
})
export class FileStorageProvider implements Provider<FileStorage> {
  constructor(@config() private options: multer.Options = {}) {
    if (!this.options.storage) {
      // Default to in-memory storage
      this.options.storage = multer.memoryStorage();
    }
  }

  value(): RequestHandler {
    return multer(this.options).any();
  }
}
