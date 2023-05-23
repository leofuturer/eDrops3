import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { CountSchema, Filter, repository } from '@loopback/repository';
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
  ): Promise<object> {
    const username = await this.customerRepository
      .user(id)
      .then(user => {
        return user.username;
      });
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, async (err: unknown) => {
        if (err) reject(err);
        else {
          // console.log(request.files);
          resolve(
            process.env.NODE_ENV !== 'production'
              ? await this.customerRepository.uploadDisk(
                request,
                response,
                username as string,
                id as string,
              )
              : await this.customerRepository.uploadS3(
                request,
                response,
                username as string,
                id as string,
              ),
          );
        }
      });
    });
  }

  @oas.response.file()
  @get('/customers/{id}/files/{fileId}', {
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
    const filename = await this.customerRepository
      .fileInfos(id)
      .find({ where: { id: fileId } })
      .then(files => {
        return files[0].containerFileName;
      });
    return process.env.NODE_ENV !== 'production'
      ? this.fileRepository.downloadDisk(filename, response)
      : this.fileRepository.downloadS3(filename, response);
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
  ): Promise<void> {
    // Soft delete
    this.customerRepository.fileInfos(id).delete({ id: fileId });
    // Hard delete
  }
}
