import { authenticate } from '@loopback/authentication';
import { intercept } from '@loopback/core';
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors,
  param,
  post,
  requestBody
} from '@loopback/rest';
import { OrderItemCreateInterceptor } from '../interceptors';
import { OrderChip, OrderInfo } from '../models';
import { OrderInfoRepository } from '../repositories';

export class OrderInfoOrderChipController {
  constructor(
    @repository(OrderInfoRepository)
    protected orderInfoRepository: OrderInfoRepository,
  ) {}

  @get('/orderInfos/{id}/orderChips', {
    responses: {
      '200': {
        description: 'Array of OrderInfo has many OrderChip',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OrderChip)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    // @param.query.object('filter') filter?: Filter<OrderChip>,
  ): Promise<OrderChip[]> {
    let orderInfo = await this.orderInfoRepository.findById(id);
    console.log(orderInfo);
    console.log('this is new');
    // return orderInfo.orderChips;
    return [];
  }

  @authenticate('jwt')
  @intercept(OrderItemCreateInterceptor.BINDING_KEY)
  @post('/orderInfos/{id}/addOrderChipToCart', {
    responses: {
      '200': {
        description: 'Added orderChip to cart',
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof OrderInfo.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderChip, {
            title: 'NewOrderChipInOrderInfo',
            exclude: ['id'],
            partial: true,
          }),
        },
      },
    })
    orderChip: Omit<OrderChip, 'id'>,
  ): Promise<void> {
    this.orderInfoRepository
      .orderChips(id)
      .find({
        where: {
          variantIdShopify: orderChip.variantIdShopify,
          otherDetails: orderChip.otherDetails,
        },
      })
      .then(orderChips => {
        console.log('orderchips stuff');
        console.log(orderChips);
        if (orderChips.length > 1) {
          throw new HttpErrors.UnprocessableEntity(
            'More than one entry for product',
          );
        } else if (orderChips.length === 0) {
          console.log('0 here');
          this.orderInfoRepository
            .orderChips(id)
            .create(orderChip)
            .then(orderChipInstance => {
              console.log(
                `Created orderChip with id ${orderChipInstance.id}, product ${orderChipInstance.name}`,
              );
              return orderChipInstance;
            })
            .catch(err => {
              console.log(err);
            });
        } else if (orderChips.length === 1) {
          this.orderInfoRepository.updateById(orderChips[0].id, {
            quantity: orderChips[0].quantity + orderChip.quantity,
          });
        } else {
          throw new HttpErrors.UnprocessableEntity(
            'Unknown entries for product',
          );
        }
      })
      .catch(err => {
        throw new HttpErrors.InternalServerError(err);
      });
  }
}
