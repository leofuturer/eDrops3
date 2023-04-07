import {Getter, inject} from '@loopback/core';
import {
  AnyObject,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import _ from 'lodash';
import {CustomRequest} from '../controllers/order-info.controller';
import {MysqlDsDataSource} from '../datasources';
import {
  OrderChip,
  OrderInfo,
  OrderInfoRelations,
  OrderProduct,
} from '../models';
import {OrderChipRepository} from './order-chip.repository';
import {OrderProductRepository} from './order-product.repository';
import {UserRepository} from './user.repository';
import crypto from 'crypto';
import { HttpErrors } from '@loopback/rest';
import Pusher from 'pusher';

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

  public pusher: Pusher;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @repository.getter('OrderProductRepository')
    protected orderProductRepositoryGetter: Getter<OrderProductRepository>,
    @repository.getter('OrderChipRepository')
    protected orderChipRepositoryGetter: Getter<OrderChipRepository>,
    @repository.getter('UserRepository')
    private userRepositoryGetter: Getter<UserRepository>,
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

    this.pusher = new Pusher({
      appId: process.env.APP_PUSHER_API_ID as string,
      key: process.env.APP_PUSHER_API_KEY as string,
      secret: process.env.APP_PUSHER_API_SECRET as string,
      cluster: process.env.APP_PUSHER_API_CLUSTER as string,
      useTLS: true,
    });
  }

  // TODO: fix validation function
  // Current error: RangeError: Input buffers must have the same byte length
  // validateShopifyWebhook(requestBody: string, hmacHeader: string): boolean {
  //   const hmac = crypto.createHmac('sha256', process.env.SHOPIFY_ADMIN_SECRET ?? "");
  //   hmac.update(requestBody);
  //   const calculatedHmac = hmac.digest('hex');

  //   return crypto.timingSafeEqual(Buffer.from(calculatedHmac), Buffer.from(hmacHeader));
  // }

  async newOrderCreated(body: AnyObject, req: CustomRequest): Promise<void> {
    console.log(
      `Shopify order creation webhook token: ${req?.headers?.['x-shopify-hmac-sha256']}`,
    );
    // console.log(body);
    console.log(
      `An order was just paid using email ${body.email}, receiving webhook info from Shopify`,
    );
    // TODO: Verify the request came from Shopify
    // if (!this.validateShopifyWebhook(JSON.stringify(body), req?.headers?.['x-shopify-hmac-sha256'] ?? "")) {
    //   console.log("Received invalid webhook")
    //   throw HttpErrors.Unauthorized("Invalid webhook");
    // }
    if (body.checkout_token) {
      // console.log(`Checkout token: ${body.checkout_token}`);
      this.findOne({where: {checkoutToken: body.checkout_token}})
        .then(async(orderInfoInstance) => {
          // console.log(`Found order info instance: ${JSON.stringify(orderInfoInstance)}`);
          const date = new Date();
          // Create new orderInfo using updated data from Shopify
          const orderInfo = _.merge(orderInfoInstance, {
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
          await this.pusher.trigger(`checkout-${orderInfo.checkoutToken}`, 'checkout-completed', orderInfo);
          await this.update(orderInfo);
        })
        .catch(err => console.log(err));
    }
  }
}
