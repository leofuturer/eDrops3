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

  @get('/customers/{id}/file-infos', {
    responses: {
      '200': {
        description: 'Array of Customer has many FileInfo',
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

  @post('/customers/{id}/file-infos', {
    responses: {
      '200': {
        description: 'Customer model instance',
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

  @patch('/customers/{id}/file-infos', {
    responses: {
      '200': {
        description: 'Customer.FileInfo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FileInfo, {partial: true}),
        },
      },
    })
    fileInfo: Partial<FileInfo>,
    @param.query.object('where', getWhereSchemaFor(FileInfo)) where?: Where<FileInfo>,
  ): Promise<Count> {
    return this.customerRepository.fileInfos(id).patch(fileInfo, where);
  }

  @del('/customers/{id}/file-infos', {
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
