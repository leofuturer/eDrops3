import { inject } from '@loopback/core';
import {
  Filter, FilterExcludingWhere, repository
} from '@loopback/repository';
import {
  Response,
  RestBindings, oas,
  get,
  getModelSchemaRef, param, response
} from '@loopback/rest';
import { FileInfo } from '../models';
import { FileInfoRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

export class FileInfoController {
  constructor(
    @repository(FileInfoRepository)
    public fileInfoRepository : FileInfoRepository,
  ) {}

  // TODO:RBAC Admin only
  @authenticate('jwt')
  @get('/files')
  @response(200, {
    description: 'Array of FileInfo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FileInfo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(FileInfo) filter?: Filter<FileInfo>,
  ): Promise<FileInfo[]> {
    return this.fileInfoRepository.find(filter);
  }

  @oas.response.file()
  @authenticate('jwt')
  @get('/files/{id}')
  @response(200, {
    description: 'FileInfo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FileInfo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(FileInfo, {exclude: 'where'}) filter?: FilterExcludingWhere<FileInfo>
  ): Promise<FileInfo> {
    return this.fileInfoRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @get('/files/{id}/download')
  @response(200, {
    description: 'FileInfo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FileInfo, {includeRelations: true}),
      },
    },
  })
  async downloadById(
    @param.path.number('id') id: number,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Response> {
    return this.fileInfoRepository.downloadById(id, response);
  }
}
