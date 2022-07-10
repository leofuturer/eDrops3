import {authenticate} from '@loopback/authentication';
import {inject, intercept} from '@loopback/core';
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
  Request,
  RestBindings,
  HttpErrors,
} from '@loopback/rest';
import {OrderItemCreateInterceptor} from '../interceptors';
import {OrderInfo, OrderProduct} from '../models';
import {OrderInfoRepository} from '../repositories';
import {CustomRequest} from './order-info.controller';

export class OrderInfoOrderProductController {
  constructor(
    @repository(OrderInfoRepository)
    protected orderInfoRepository: OrderInfoRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request,
  ) {}

  @get('/orderInfos/{id}/orderProducts', {
    responses: {
      '200': {
        description: 'Array of OrderInfo has many OrderProduct',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OrderProduct)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<OrderProduct>,
  ): Promise<OrderProduct[]> {
    return this.orderInfoRepository.orderProducts(id).find(filter);
  }

  @authenticate('jwt')
  @intercept(OrderItemCreateInterceptor.BINDING_KEY)
  @post('/orderInfos/{id}/addOrderProductToCart', {
    responses: {
      '200': {
        description: 'OrderInfo model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(OrderProduct)},
        },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof OrderInfo.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderProduct, {
            title: 'NewOrderProductInOrderInfo',
            exclude: ['id'],
            optional: ['orderId'],
          }),
        },
      },
    })
    orderProduct: Omit<OrderProduct, 'id'>,
  ): Promise<void> {
    this.orderInfoRepository
      .orderProducts(id)
      .find({
        where: {
          variantIdShopify: orderProduct.variantIdShopify,
          otherDetails: orderProduct.otherDetails,
        },
      })
      .then(orderProducts => {
        if (orderProducts.length > 1) {
          throw new HttpErrors.UnprocessableEntity('More than one entry for product');
        } else if (orderProducts.length === 0) {
          this.orderInfoRepository
            .orderProducts(id)
            .create(orderProduct)
            .then(orderProduct => {
              console.log(
                `Created orderProduct with product order id ${orderProduct.id}, product ${orderProduct.description}`,
              );
              return orderProduct;
            });
        } else if (orderProducts.length === 1) {
          this.orderInfoRepository.updateById(orderProducts[0].id, {
            quantity: orderProducts[0].quantity + orderProduct.quantity,
          });
        } else {
          throw new HttpErrors.UnprocessableEntity('Unknown entries for product');
        }
      })
      .catch(err => {
        throw new HttpErrors.InternalServerError(err);
      });
  }
}
