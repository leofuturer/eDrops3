import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Customer,
  FileInfo,
} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerFileInfoController {
  constructor(
    @repository(CustomerRepository) protected customerRepository: CustomerRepository,
  ) { }

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
        content: {'application/json': {schema: getModelSchemaRef(FileInfo)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Customer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FileInfo, {
            title: 'NewFileInfoInCustomer',
            exclude: ['id'],
            optional: ['customerId']
          }),
        },
      },
    }) fileInfo: Omit<FileInfo, 'id'>,
  ): Promise<FileInfo> {
    return this.customerRepository.fileInfos(id).create(fileInfo);
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
    @param.path.string('id') id: string,
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
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(FileInfo)) where?: Where<FileInfo>,
  ): Promise<Count> {
    return this.customerRepository.fileInfos(id).delete(where);
  }
}
