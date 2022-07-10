import {inject} from '@loopback/core';
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
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  Response,
  response,
  RestBindings,
} from '@loopback/rest';
import {FoundryWorker, OrderChip} from '../models';
import {FoundryWorkerRepository, OrderChipRepository} from '../repositories';
import {SecurityBindings, UserProfile} from '@loopback/security';

export class FoundryWorkerOrderChipController {
  constructor(
    @repository(FoundryWorkerRepository)
    protected foundryWorkerRepository: FoundryWorkerRepository,
    @repository(OrderChipRepository)
    protected orderChipRepository: OrderChipRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
    @inject(SecurityBindings.USER, {optional: true})
    protected user: UserProfile,
  ) {}

  @get('/foundryWorkers/{id}/orderChips', {
    responses: {
      '200': {
        description: 'Array of FoundryWorker has many OrderChip',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OrderChip)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<OrderChip>,
  ): Promise<OrderChip[]> {
    return this.foundryWorkerRepository.orderChips(id).find(filter);
  }

  @get('/foundryWorkers/{id}/downloadFile')
  @response(200, {
    description: 'FoundryWorker DOWNLOAD FILE success',
  })
  async downloadFile(
    @param.path.string('id') id: string,
    @param.query.string('chipOrderId') chipOrderId: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    if (!chipOrderId)
      throw new HttpErrors.BadRequest('chipOrderId is required');
    this.foundryWorkerRepository
      .orderChips(id)
      .find({
        where: {id: chipOrderId},
        include: [{relation: 'fileInfo', scope: {fields: ['fileName']}}],
      })
      .then(chipOrder => {
        if (!chipOrder) throw new HttpErrors.NotFound('chipOrder not found');
        if (chipOrder[0].id !== this.user.id)
          throw new HttpErrors.Forbidden('Unauthorized access to file');
        return chipOrder[0].fileName;
      })
      .then(fileName => {
        response.download(fileName);
      })
      .catch(err => {
        throw new HttpErrors.InternalServerError(err);
      });
    // return this.foundryWorkerRepository.downloadFile();
  }
}
