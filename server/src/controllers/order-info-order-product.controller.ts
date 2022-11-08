import { authenticate } from '@loopback/authentication';
import { inject, intercept } from '@loopback/core';
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors, param, patch, post, Request, requestBody, response, RestBindings
} from '@loopback/rest';
import { OrderItemCreateInterceptor } from '../interceptors';
import { OrderInfo, OrderProduct } from '../models';
import { OrderInfoRepository } from '../repositories';

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
    // @param.query.object('filter') filter?: Filter<OrderProduct>,
  ): Promise<OrderProduct[]> {
    // return this.orderInfoRepository.orderProducts(id).find(filter);
    let orderInfo = await this.orderInfoRepository.findById(id, {include: [{relation: 'orderProducts' }]});
    return orderInfo.orderProducts ?? [];
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
                `Created orderProduct with id ${orderProduct.id}, product ${orderProduct.name}`,
              );
              return orderProduct;
            });
        } else if (orderProducts.length === 1) {
          this.orderInfoRepository.orderProducts(id).patch({
            quantity: orderProducts[0].quantity + orderProduct.quantity,
          }, { id: orderProducts[0].id })
          .catch(err => {
            console.error(err);
          });
        } else {
          throw new HttpErrors.UnprocessableEntity('Unknown entries for product');
        }
      })
      .catch(err => {
        throw new HttpErrors.InternalServerError(err);
      });
  }

  @patch('/orderInfos/{id}/updateProductLineItemId')
  @response(204, {
    description: 'OrderProduct LineItemIdShopify PATCH success',
  })
  async patch(
    @param.path.number('id') id: typeof OrderInfo.prototype.id,
    @requestBody() body: { 
      lineItemIdShopify: string; 
      variantIdShopify: string; 
      otherDetails: string;
    },
  ): Promise<void> {
    this.orderInfoRepository
      .orderProducts(id)
      .find({
        where: {
          variantIdShopify: body.variantIdShopify,
          otherDetails: body.otherDetails,
        },
      })
      .then(orderProducts => {
        if (orderProducts.length > 1) {
          throw new HttpErrors.UnprocessableEntity('More than one entry for product');
        } else if (orderProducts.length === 0) {
          throw new HttpErrors.UnprocessableEntity('Entry for product does not exist');
        } else if (orderProducts.length === 1) {
          this.orderInfoRepository.orderProducts(id).patch({
            lineItemIdShopify: body.lineItemIdShopify,
          }, { id: orderProducts[0].id })
          .catch(err => {
            console.error(err);
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