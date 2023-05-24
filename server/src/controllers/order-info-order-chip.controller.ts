import { authenticate } from '@loopback/authentication';
import { intercept } from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response
} from '@loopback/rest';
import { OrderItemCreateInterceptor } from '../interceptors';
import { OrderChip, OrderInfo } from '../models';
import { OrderInfoRepository } from '../repositories';

export class OrderInfoOrderChipController {
  constructor(
    @repository(OrderInfoRepository)
    protected orderInfoRepository: OrderInfoRepository,
  ) {}

  @get('/orders/{id}/order-chips', {
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
  ): Promise<OrderChip[]> {
    const orderInfo = await this.orderInfoRepository.findById(id, {include: [{relation: 'orderChips' }]});
    return orderInfo.orderChips ?? [];
  }

  @authenticate('jwt')
  @intercept(OrderItemCreateInterceptor.BINDING_KEY)
  @post('/orders/{id}/order-chips', {
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
        if (orderChips.length > 1) {
          throw new HttpErrors.UnprocessableEntity(
            'More than one entry for product',
          );
        } else if (orderChips.length === 0) {
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
              console.error(err);
            });
        } else if (orderChips.length === 1) {
          this.orderInfoRepository.orderChips(id).patch({
            quantity: orderChips[0].quantity + orderChip.quantity,
            lastUpdated: orderChips[0].lastUpdated,
          }, { id: orderChips[0].id })
          .catch(err => {
            console.error(err);
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

  @patch('/orders/{id}/order-chips')
  @response(204, {
    description: 'OrderChip LineItemIdShopify PATCH success',
  })
  async patch(
    @param.path.number('id') id: typeof OrderInfo.prototype.id,
    @requestBody() body: { 
      lineItemIdShopify: string; 
      variantIdShopify: string; 
      otherDetails: string;
      updatedAt: string; 
    },
  ): Promise<void> {
    this.orderInfoRepository
      .orderChips(id)
      .find({
        where: {
          variantIdShopify: body.variantIdShopify,
          otherDetails: body.otherDetails,
        },
      })
      .then(orderChips => {
        if (orderChips.length > 1) {
          throw new HttpErrors.UnprocessableEntity(
            'More than one entry for product',
          );
        } else if (orderChips.length === 0) {
          throw new HttpErrors.UnprocessableEntity(
            'Entry for product does not exist',
          );
        } else if (orderChips.length === 1) {
          this.orderInfoRepository.orderChips(id).patch({
            lineItemIdShopify: body.lineItemIdShopify,
            lastUpdated: body.updatedAt,
          }, { id: orderChips[0].id })
          .catch(err => {
            console.error(err);
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
