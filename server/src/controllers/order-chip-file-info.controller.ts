import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  OrderChip,
  FileInfo,
} from '../models';
import {OrderChipRepository} from '../repositories';

export class OrderChipFileInfoController {
  constructor(
    @repository(OrderChipRepository)
    public orderChipRepository: OrderChipRepository,
  ) { }

  @get('/order-chips/{id}/file-info', {
    responses: {
      '200': {
        description: 'FileInfo belonging to OrderChip',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FileInfo)},
          },
        },
      },
    },
  })
  async getFileInfo(
    @param.path.number('id') id: typeof OrderChip.prototype.id,
  ): Promise<FileInfo> {
    return this.orderChipRepository.fileInfo(id);
  }
}
