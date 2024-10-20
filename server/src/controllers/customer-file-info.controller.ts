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
  patch,
  requestBody
} from '@loopback/rest';
import { Customer, FileInfo } from '../models';
import { CustomerRepository, FileInfoRepository, UserRepository } from '../repositories';
import { FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY } from '../services';

export class CustomerFileInfoController {
  /**
   * Constructor
   * @param handler - Inject an Express request handler to deal with the request
   */
  constructor(
    @repository(UserRepository)
    protected userRepository: UserRepository,
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

  @post('/guest/files', {
    responses: {
      '200': {
        description: 'Upload a file without logging in',
        content: { 'application/json': { schema: { type: 'object' } } },
      },
    },
  })
  async guestFileUpload(
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<FileInfo> {
    return new Promise<FileInfo>((resolve, reject) => {
      this.handler(request, response, async (err: unknown) => {
        if (err) reject(err);
        else {
          // console.log(request.files);
          resolve(
            await this.customerRepository.uploadFile(request, response, 'aaaaaaaa-bbbb-aaaa-aaaa-aaaaaaaaaaaa')
          );
        }
      });
    });
  }

  @authenticate('jwt')
  @patch('/customers/{id}/guestTransfer/{fileId}', {
    responses: {
      '200': {
        description: 'Transfer ownership of a file',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(FileInfo) },
          },
        },
      },
    },
  })
  async transferFile(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @param.path.string('fileId') fileId: string,
  ): Promise<string> {
    // find the file, change the fields 'uploader' and 'customerID' to match the currently logged in user
    const user = await this.userRepository.findById(id);
    const username = user.username;
    const existingRecord = await this.customerRepository.fileInfos('aaaaaaaa-bbbb-aaaa-aaaa-aaaaaaaaaaaa').find({where: {id: fileId}});
    if (existingRecord.length==0) return 'error transferring';

    const newRecord = existingRecord[0];
    if (Date.now()-Date.parse(newRecord.uploadTime)>300000) return 'Guest file expired. You must log in within 5 minutes to transfer files.';
    newRecord.customerId = id;
    newRecord.uploader = username;
    delete newRecord["id"];
    const created = await this.customerRepository.fileInfos(id).create(newRecord);
    await this.customerRepository.fileInfos('aaaaaaaa-bbbb-aaaa-aaaa-aaaaaaaaaaaa').delete({id: fileId});
    return created.id || 'error transferring';
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
    @param.path.string('fileId') fileId: string,
  ): Promise<FileInfo> {
    const filesInfos = await this.customerRepository.fileInfos(id).find({ where: { id: fileId } });
    return filesInfos[0];
  }

  @get('/guest/files/{fileId}', {
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
  async guestGetById(
    @param.path.string('fileId') fileId: string,
  ): Promise<FileInfo> {
    const filesInfos = await this.customerRepository.fileInfos('aaaaaaaa-bbbb-aaaa-aaaa-aaaaaaaaaaaa').find({ where: { id: fileId } });
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
    @param.path.string('fileId') fileId: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Response> {
    return this.customerRepository.downloadById(id, fileId, response);
  }

  @oas.response.file()
  @get('/guest/files/{fileId}/download', {
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
  async guestDownloadFile(
    @param.path.string('fileId') fileId: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Response> {
    return this.customerRepository.downloadById('aaaaaaaa-bbbb-aaaa-aaaa-aaaaaaaaaaaa', fileId, response);
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
    @param.path.string('fileId') fileId: string,
  ): Promise<Count> {
    // Should we soft delete?
    // Hard delete
    return this.customerRepository.fileInfos(id).delete({ id: fileId });
  }
}
