import {inject} from '@loopback/core';
import {CountSchema, Filter, repository} from '@loopback/repository';
import {
  del,
  ExpressRequestHandler,
  get,
  getModelSchemaRef,
  HttpErrors,
  oas,
  param,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import path from 'path';
import {Customer, FileInfo} from '../models';
import {CustomerRepository} from '../repositories';
import {FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY} from '../services';

export class CustomerFileInfoController {
  /**
   * Constructor
   * @param handler - Inject an Express request handler to deal with the request
   */
  constructor(
    @repository(CustomerRepository)
    protected customerRepository: CustomerRepository,
    @inject(FILE_UPLOAD_SERVICE) private handler: ExpressRequestHandler,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
  ) {}

  @get('/customers/{id}/customerFiles', {
    responses: {
      '200': {
        description: 'Retrieve all customer files',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FileInfo)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.query.object('filter') filter?: Filter<FileInfo>,
  ): Promise<FileInfo[]> {
    return this.customerRepository.fileInfos(id).find(filter);
  }

  @post('/customers/{id}/uploadFile', {
    responses: {
      '200': {
        description: 'Upload a file',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async fileUpload(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    const username = await this.customerRepository
      .findById(id)
      .then(customer => {
        return customer.username;
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
  @get('/customers/{id}/downloadFile', {
    responses: {
      '200': {
        description: 'Download a file',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FileInfo)},
          },
        },
      },
    },
  })
  async downloadFile(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.query.number('fileId') fileId: number,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Response> {
    const filename = await this.customerRepository
      .fileInfos(id)
      .find({where: {id: fileId}})
      .then(files => {
        return files[0].containerFileName;
      });
    return process.env.NODE_ENV !== 'production'
      ? this.customerRepository.downloadDisk(filename, response)
      : this.customerRepository.downloadS3(filename, response);
  }

  @del('/customers/{id}/deleteFile', {
    responses: {
      '200': {
        description: 'Customer.FileInfo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.query.number('fileId') fileId: number,
  ): Promise<void> {
    // Soft delete
    this.customerRepository.fileInfos(id).delete({where: {id: fileId}});
    // Hard delete
  }
}
