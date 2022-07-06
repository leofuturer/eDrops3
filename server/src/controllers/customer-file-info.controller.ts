import { inject } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  ExpressRequestHandler,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {Customer, FileInfo} from '../models';
import {CustomerRepository} from '../repositories';
import { FILE_UPLOAD_SERVICE } from '../services';
import { calculate } from '../lib/toolbox/calculate';

const CONTAINER_NAME = process.env.S3_BUCKET_NAME || 'test_container';

export class CustomerFileInfoController {
  /**
   * Constructor
   * @param handler - Inject an Express request handler to deal with the request
   */
  constructor(
    @repository(CustomerRepository)
    protected customerRepository: CustomerRepository,
    @inject(FILE_UPLOAD_SERVICE) private handler: ExpressRequestHandler,
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
    @param.path.string('id') id: string,
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
    interface MulterFileInfo {
      fieldname: string;
      originalname: string;
      mimetype: string;
      size: number;
      filename: string;
    }
    // Parse multipart/form-data file info from request
    const mapper  = (f: globalThis.Express.Multer.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      filename: f.filename
    });
    let files: MulterFileInfo[] = [];
    const uploadedFiles = request.files;
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }

    const username = await this.customerRepository.findById(id).then(customer => {
      return customer.username;
    });

    const fileInfos : Partial<FileInfo> = files.map((f: MulterFileInfo) => {
      return {
        uploadTime: calculate.currentTime(),
        fileName: request.body.hasOwnProperty('newName') ? request.body.newName : f.originalname,
        containerFileName: f.filename,
        container: CONTAINER_NAME, // need fix
        uploader: username,
        customerId: id,
        isDeleted: false,
        isPublic: request.body.isPublic === 'public',
        unit: request.body.unit,
        fileSize: calculate.formatBytes(f.size, 1),
      };
    });

    const fields = request.body;

    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          const customer = this.customerRepository.fileInfos(id).create(fileInfos);
          resolve({files, fields});
        }
      });
    });
  }

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
    @param.query.object('filter') filter?: Filter<FileInfo>,
  ): Promise<FileInfo[]> {
    return this.customerRepository.fileInfos(id).find(filter);
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
    @param.query.object('where', getWhereSchemaFor(FileInfo))
    where?: Where<FileInfo>,
  ): Promise<Count> {
    return this.customerRepository.fileInfos(id).delete(where);
  }
}
