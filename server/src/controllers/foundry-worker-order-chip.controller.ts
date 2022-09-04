import { inject } from '@loopback/core';
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors,
  param, Response,
  response,
  RestBindings
} from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
import { OrderChip } from '../models';
import { FoundryWorkerRepository, OrderChipRepository, OrderInfoRepository } from '../repositories';

export class FoundryWorkerOrderChipController {
  constructor(
    @repository(FoundryWorkerRepository)
    protected foundryWorkerRepository: FoundryWorkerRepository,
    @repository(OrderChipRepository)
    protected orderChipRepository: OrderChipRepository,
    @repository(OrderInfoRepository)
    protected orderInfoRepository: OrderInfoRepository,
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
    return await this.foundryWorkerRepository.orderChips(id).find(filter);

    // let allOrderChips: ChipFabOrder[] = [];
    // const foundryWorker = await this.foundryWorkerRepository.findById(id);
    // const orderChips = await this.foundryWorkerRepository.orderChips(id).find(filter);
    // const promises = orderChips.map(orderChip => {
    //   return this.orderInfoRepository.findById(orderChip.orderInfoId);
    // })
    // return Promise.all<OrderInfo>(promises).then(orderInfoArr => {
    //   orderInfoArr.map((orderInfo, index) => {
    //     let chipFabOrder = new ChipFabOrder(orderChips[index]);
    //     chipFabOrder.customerName = orderInfo.sa_name;
    //     chipFabOrder.workerName = `${foundryWorker.firstName} ${foundryWorker.lastName}`;
    //     allOrderChips.push(chipFabOrder);
    //   }) 

    //   return allOrderChips;
    // })
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
