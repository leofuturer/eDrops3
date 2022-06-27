import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
  Order,
} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {
  OrderInfo,
  OrderInfoRelations,
  OrderProduct,
  OrderChip,
  AccessToken,
} from '../models';
import {OrderProductRepository} from './order-product.repository';
import {OrderChipRepository} from './order-chip.repository';
import {
  CallbackObject,
  RequestBodyObject,
  RequestContext,
} from '@loopback/rest';
import {reject} from 'lodash';
import { IncomingHttpHeaders } from 'http';
import { CustomHeaders } from '../controllers/order-info.controller';
import { AccessTokenRepository } from './access-token.repository';
import { UserBaseRepository } from './user-base.repository';

export class OrderInfoRepository extends DefaultCrudRepository<
  OrderInfo,
  typeof OrderInfo.prototype.id,
  OrderInfoRelations
> {
  public readonly orderProducts: HasManyRepositoryFactory<
    OrderProduct,
    typeof OrderInfo.prototype.id
  >;

  public readonly orderChips: HasManyRepositoryFactory<
    OrderChip,
    typeof OrderInfo.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @repository.getter('OrderProductRepository')
    protected orderProductRepositoryGetter: Getter<OrderProductRepository>,
    @repository.getter('OrderChipRepository')
    protected orderChipRepositoryGetter: Getter<OrderChipRepository>,
    @repository.getter('AccessTokenRepository') 
    private accessTokenRepositoryGetter : Getter<AccessTokenRepository>,
    @repository.getter('UserBaseRepository') 
    private userBaseRepositoryGetter : Getter<UserBaseRepository>,
    ) {
    super(OrderInfo, dataSource);
    this.orderChips = this.createHasManyRepositoryFactoryFor(
      'orderChips',
      orderChipRepositoryGetter,
    );
    this.registerInclusionResolver(
      'orderChips',
      this.orderChips.inclusionResolver,
    );
    this.orderProducts = this.createHasManyRepositoryFactoryFor(
      'orderProducts',
      orderProductRepositoryGetter,
    );
    this.registerInclusionResolver(
      'orderProducts',
      this.orderProducts.inclusionResolver,
    );
  }

  async addOrderChipToCart (body: Omit<OrderInfo, "id">, req: CustomHeaders) {
    // console.log(body);
    // Find the specified orderInfo (top level)
    const accessTokenRepository = await this.accessTokenRepositoryGetter();
    const userBaseRepository = await this.userBaseRepositoryGetter();
    this.findById(body.orderInfoId).then(orderInfo => {
      // console.log(orderInfo);
        // Then see if product order already created, if we need to create one
        accessTokenRepository.findById(req?.headers['x-edrop-userbase']).then(token =>  {
            userBaseRepository.findById(token.userId).then(user => {
              if (user.userType !== 'customer') {
                console.log('only customer can add chip to cart');
              }
              }).catch(err => console.log(err));
            }).catch(err => console.log(err))
        if (orderInfo.customerId !== req.accessToken.userId) {
          console.log('customer and order info does not match');
        }
        else {
          this.orderChips({where: {variantIdShopify: body.variantIdShopify, otherDetails: body.otherDetails}}).then((err, orderChips) => {
            // variant ID should uniquely identify it
            // console.log(orderProducts);
            if (err || orderChips.length > 1) {
              console.error('Error occurred or more than one entry for product');
              console.error(err);
              cb(err);
            }
            // not present, need to create a new one
            else if (orderChips.length === 0) {
              orderInfo.orderChips.create(body, (err, orderChip) => {
                // console.log(orderProduct);
                if (err) {
                  console.error(err);
                  cb(err);
                } else {
                  console.log(`Created orderChips with product order id ${orderChip.id}, product ${orderChip.description}`);
                  cb(null);
                }
              });
            } else if (orderChips.length === 1) { // already exists
              const newQtyData = {
                quantity: orderChips[0].quantity + body.quantity,
              };
              orderChips[0].updateAttributes(newQtyData).then(orderChip => {
                console.log(`Updated quantity to ${orderChip.quantity} for product order ID: ${orderChip.id}, product ${orderChip.description}`);
              }
              ).catch(err => 
                  console.error(err)
              );
            }
          });
        }
    }).catch(err => console.log(err));
  };

  async newOrderCreated(body: Omit<OrderInfo, "id">, req: CustomRequest ): Promise<void> {
    console.log(
      `Shopify order creation webhook token: ${req?.headers?.['x-shopify-hmac-sha256']}`
    );
    // console.log(body);
    console.log(
      `An order was just paid using email ${body.email}, receiving webhook info from Shopify`,
    );
    // TODO: Verify the request came from Shopify
    if (body.checkout_token !== null) {
      super
        .findOne({where: {checkoutToken: body.checkout_token}})
        .then(orderInfoInstance => {
          const date = new Date();
          super.update(orderInfoInstance as OrderInfo, {
            orderInfoId: body.id,
            orderStatusURL: body.order_status_url,
            orderComplete: true,
            status: 'Payment made',
            lastModifiedAt: date.toISOString(),

            fees_and_taxes: (
              parseFloat(body.total_price) -
              parseFloat(body.total_line_items_price)
            ).toString(),
            subtotal_cost: parseFloat(body.total_line_items_price).toString(),
            total_cost: parseFloat(body.total_price).toString(),

            user_email: body.email,

            sa_name: `${body.shipping_address.first_name} ${body.shipping_address.last_name}`,
            sa_address1: body.shipping_address.address1,
            sa_address2: body.shipping_address.address2,
            sa_city: body.shipping_address.city,
            sa_province: body.shipping_address.province,
            sa_zip: body.shipping_address.zip,
            sa_country: body.shipping_address.country,

            ba_name: `${body.billing_address.first_name} ${body.billing_address.last_name}`,
            ba_address1: body.billing_address.address1,
            ba_address2: body.billing_address.address2,
            ba_city: body.billing_address.city,
            ba_province: body.billing_address.province,
            ba_zip: body.billing_address.zip,
            ba_country: body.billing_address.country,
          });
        })
        .catch(err => console.log(err));
    }
  }
}
