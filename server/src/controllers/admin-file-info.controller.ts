import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import {
  ExpressRequestHandler,
  get,
  getModelSchemaRef, oas,
  param, Response,
  RestBindings
} from '@loopback/rest';
import { FileInfo } from '../models';
import { AdminRepository, FileInfoRepository } from '../repositories';
import { FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY } from '../services';

export class AdminFileInfoController {
  /**
   * Constructor
   * @param handler - Inject an Express request handler to deal with the request
   */
  constructor(
    @repository(AdminRepository)
    protected adminRepository: AdminRepository,
    @repository(FileInfoRepository)
    protected fileRepository: FileInfoRepository,
    @inject(FILE_UPLOAD_SERVICE) private handler: ExpressRequestHandler,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
  ) { }

  @oas.response.file()
  @get('/admins/downloadFile', {
    responses: {
      '200': {
        description: 'Download a file',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(FileInfo) },
          },
        },
      },
    },
  })
  async downloadFile(
    @param.query.number('fileId') fileId: number,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Response> {
    const filename = await this.fileRepository
      .find({ where: { id: fileId } })
      .then(files => {
        return files[0].containerFileName;
      });
    return process.env.NODE_ENV !== 'production'
      ? this.fileRepository.downloadDisk(filename, response)
      : this.fileRepository.downloadS3(filename, response);
  }
}