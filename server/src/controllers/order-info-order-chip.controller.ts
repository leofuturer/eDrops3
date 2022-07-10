import {authenticate} from '@loopback/authentication';
import {intercept} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import e from 'cors';
import {OrderItemCreateInterceptor} from '../interceptors';
import {OrderInfo, OrderChip} from '../models';
import {OrderInfoRepository} from '../repositories';

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
    @param.query.object('filter') filter?: Filter<OrderChip>,
  ): Promise<OrderChip[]> {
    return this.orderInfoRepository.orderChips(id).find(filter);
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
          }),
        },
      },
    })
    orderChip: Omit<OrderChip, 'id'>,
  ): Promise<void> {
    console.log(orderChip);
    console.log('orderinfo orderchip');
    this.orderInfoRepository
      .orderChips(id)
      .find({
        where: {
          variantIdShopify: orderChip.variantIdShopify,
          otherDetails: orderChip.otherDetails,
        },
      })
      .then(orderChips => {
        console.log(orderChips);
        if (orderChips.length > 1) {
          throw new HttpErrors.UnprocessableEntity(
            'More than one entry for product',
          );
        } else if (orderChips.length === 0) {
          this.orderInfoRepository
            .orderChips(id)
            .create(orderChip)
            .then(orderChip => {
              console.log(
                `Created orderProduct with product order id ${orderChip.id}, product ${orderChip.description}`,
              );
              return orderChip;
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
