import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {FileInfo} from '../models';
import {FileInfoRepository} from '../repositories';

export class FileInfoController {
  constructor(
    @repository(FileInfoRepository)
    public fileInfoRepository : FileInfoRepository,
  ) {}

  @get('/fileInfos')
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
}
