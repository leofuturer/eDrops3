import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { Count, CountSchema, Filter, repository } from '@loopback/repository';
import {
  ExpressRequestHandler,
  Request,
  Response,
  RestBindings,
  del,
  get,
  getModelSchemaRef,
  oas,
  param,
  post,
  requestBody
} from '@loopback/rest';
import { Customer, FileInfo } from '../models';
import { CustomerRepository, FileInfoRepository } from '../repositories';
import { FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY } from '../services';

export class CustomerFileInfoController {
  /**
   * Constructor
   * @param handler - Inject an Express request handler to deal with the request
   */
  constructor(
    @repository(CustomerRepository)
    protected customerRepository: CustomerRepository,
    @repository(FileInfoRepository)
    protected fileRepository: FileInfoRepository,
    @inject(FILE_UPLOAD_SERVICE) private handler: ExpressRequestHandler,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
  ) { }

  @get('/customers/{id}/files', {
    responses: {
      '200': {
        description: 'Retrieve all customer files',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(FileInfo) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: typeof Customer.prototype.userId,
    @param.query.object('filter') filter?: Filter<FileInfo>,
  ): Promise<FileInfo[]> {
    return this.customerRepository.fileInfos(id).find(filter);
  }

  @authenticate('jwt')
  @post('/customers/{id}/files', {
    responses: {
      '200': {
        description: 'Upload a file',
        content: { 'application/json': { schema: { type: 'object' } } },
      },
    },
  })
  async fileUpload(
    @param.path.string('id') id: typeof Customer.prototype.userId,
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<FileInfo> {
    return new Promise<FileInfo>((resolve, reject) => {
      this.handler(request, response, async (err: unknown) => {
        if (err) reject(err);
        else {
          // console.log(request.files);
          resolve(
            await this.customerRepository.uploadFile(request, response, id)
          );
        }
      });
    });
  }

  @authenticate('jwt')
  @get('/customers/{id}/files/{fileId}', {
    responses: {
      '200': {
        description: 'Get a file',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(FileInfo) },
          },
        },
      },
    },
  })
  async getById(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.path.number('fileId') fileId: number,
  ): Promise<FileInfo> {
    const filesInfos = await this.customerRepository.fileInfos(id).find({ where: { id: fileId } });
    return filesInfos[0];
  }

  @authenticate('jwt')
  @oas.response.file()
  @get('/customers/{id}/files/{fileId}/download', {
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
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.path.number('fileId') fileId: number,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Response> {
    return this.customerRepository.downloadById(id, fileId, response);
  }

  @del('/customers/{id}/files/{fileId}', {
    responses: {
      '200': {
        description: 'Customer.FileInfo DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.path.number('fileId') fileId: number,
  ): Promise<Count> {
    // Should we soft delete?
    // Hard delete
    return this.customerRepository.fileInfos(id).delete({ id: fileId });
  }
}
