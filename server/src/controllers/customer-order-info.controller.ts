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
  OrderChip,
  OrderInfo,
} from '../models';
import {CustomerRepository, OrderInfoRepository} from '../repositories';

export class CustomerOrderInfoController {
  constructor(
    @repository(CustomerRepository) protected customerRepository: CustomerRepository,
    @repository(OrderInfoRepository) protected orderInfoRepository: OrderInfoRepository,
  ) { }

  @get('/customers/{id}/orderChips', {
    responses: {
      '200': {
        description: 'Get all chip orders of a customer',
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
    @param.query.object('filter') filter?: Filter<OrderInfo>,
  ): Promise<OrderChip[]> {
    let allOrderChips : OrderChip[] = [];
    const orderInfos = await this.customerRepository.orderInfos(id).find(filter);
    for(const orderInfo of orderInfos) {
      const tmpOrderChips = await this.orderInfoRepository.orderChips(orderInfo.id).find();
      allOrderChips = allOrderChips.concat(tmpOrderChips);
    }
    return allOrderChips;
  }
}
