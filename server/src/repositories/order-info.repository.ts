import { Getter, inject } from '@loopback/core';
import {
  AnyObject,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import _ from 'lodash';
import Pusher from 'pusher';
import { CustomRequest } from '../controllers/order-info.controller';
import { MysqlDsDataSource } from '../datasources';
import {
  OrderChip,
  OrderInfo,
  OrderInfoRelations,
  OrderMessage,
  OrderProduct,
} from '../models';
import { OrderChipRepository } from './order-chip.repository';
import { OrderProductRepository } from './order-product.repository';
import { OrderMessageRepository } from './order-message.repository';
import { Client, CustomAttribute, LineItem, LineItemToAdd, Product, buildClient } from 'shopify-buy';
import { DTO, Material } from '../lib/types/model';
import { FoundryWorkerRepository } from './foundry-worker.repository';
import { FileInfoRepository } from './file-info.repository';
import { CustomerRepository } from './customer.repository';
import { UserRepository } from './user.repository';

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

  public readonly orderMessages: HasManyRepositoryFactory<
    OrderMessage,
    typeof OrderMessage.prototype.id
  >;

  public readonly pusher: Pusher; // For notifying client after receiving order completion webhook
  public readonly shopify: Client;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @repository.getter('OrderProductRepository')
    protected orderProductRepositoryGetter: Getter<OrderProductRepository>,
    @repository.getter('OrderChipRepository')
    protected orderChipRepositoryGetter: Getter<OrderChipRepository>,
    @repository.getter('OrderMessageRepository')
    protected orderMessageRepositoryGetter: Getter<OrderMessageRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('FoundryWorkerRepository')
    protected foundryWorkerRepositoryGetter: Getter<FoundryWorkerRepository>,
    @repository.getter('CustomerRepository')
    protected customerRepositoryGetter: Getter<CustomerRepository>,
    @repository.getter('FileInfoRepository')
    protected fileInfoRepositoryGetter: Getter<FileInfoRepository>,
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
    this.orderMessages = this.createHasManyRepositoryFactoryFor(
      'orderMessages',
      orderMessageRepositoryGetter,
    );
    this.registerInclusionResolver(
      'orderMessages',
      this.orderMessages.inclusionResolver,
    );

    this.pusher = new Pusher({
      appId: process.env.APP_PUSHER_API_ID as string,
      key: process.env.APP_PUSHER_API_KEY as string,
      secret: process.env.APP_PUSHER_API_SECRET as string,
      cluster: process.env.APP_PUSHER_API_CLUSTER as string,
      useTLS: true,
    });

    this.shopify = buildClient({
      domain: process.env.SHOPIFY_DOMAIN as string,
      storefrontAccessToken: process.env.SHOPIFY_TOKEN as string,
    })
  }

  // TODO: fix validation function
  // Current error: RangeError: Input buffers must have the same byte length
  // validateShopifyWebhook(requestBody: string, hmacHeader: string): boolean {
  //   const hmac = crypto.createHmac('sha256', process.env.SHOPIFY_ADMIN_SECRET ?? "");
  //   hmac.update(requestBody);
  //   const calculatedHmac = hmac.digest('hex');

  //   return crypto.timingSafeEqual(Buffer.from(calculatedHmac), Buffer.from(hmacHeader));
  // }

  async addOrderProduct(id: typeof OrderInfo.prototype.id, product: Product & LineItemToAdd): Promise<OrderProduct> {
    const { variantId, quantity } = product;
    const orderInfo = await this.findById(id);
    return this.shopify.checkout.addLineItems(orderInfo.checkoutIdClient, [{ variantId, quantity }]).then((res) => {
      // @ts-expect-error NOTE: Shopify types not updated
      const lineItemId = res.lineItems.find((item) => item.variant.id === variantId).id;
      // console.log(lineItemId);
      const data: DTO<OrderProduct> = {
        orderInfoId: id,
        productIdShopify: product.id as string,
        variantIdShopify: product.variants[0].id as string,
        lineItemIdShopify: lineItemId as string,
        description: product.description,
        quantity,
        // @ts-expect-error NOTE: Shopify types not updated
        price: parseFloat(product.variants[0].price.amount),
        name: product.title,
      };
      return this.orderProducts(id).find({ where: { productIdShopify: product.id, variantIdShopify: product.variants[0].id } }).then(orderProducts => {
        if (orderProducts.length >= 1) {
          // Already existing entry for same product in order -> consolidate
          const totalQuantity = orderProducts.reduce((acc, curr) => acc + curr.quantity, 0);
          for (let i = 1; i < orderProducts.length; i++) {
            this.orderProducts(id).delete({ id: orderProducts[i].id });
          }
          this.orderProducts(id).patch({ quantity: totalQuantity + data.quantity }, { id: orderProducts[0].id });
          return this.orderProducts(id).find({ where: { id: orderProducts[0].id } }).then(orderProducts => orderProducts[0]);
        } else {
          return this.orderProducts(id).create(data);
        }
      });
    });
  }

  async updateOrderProduct(id: typeof OrderInfo.prototype.id, orderProductId: typeof OrderProduct.prototype.id, orderProduct: Partial<OrderProduct>): Promise<OrderProduct> {
    const orderInfo = await this.findById(id);
    const lineItemsToUpdate = [{ id: orderProduct.lineItemIdShopify, quantity: orderProduct.quantity }];
    return this.shopify.checkout.updateLineItems(orderInfo.checkoutIdClient, lineItemsToUpdate).then((res) => {
      return this.orderChips(id).patch(orderProduct, { id: orderProduct })
    }).then(() => {
      return this.orderChips(id).find({ where: { id: orderProductId } }).then(orderProducts => orderProducts[0]);
    });
  }

  async deleteOrderProduct(id: typeof OrderInfo.prototype.id, orderProductId: typeof OrderProduct.prototype.id): Promise<void> {
    const orderInfo = await this.findById(id);
    const orderProducts = await this.orderProducts(id).find({ where: { id: orderProductId } });
    const orderProduct = orderProducts[0];
    this.shopify.checkout.removeLineItems(orderInfo.checkoutIdClient, [orderProduct.lineItemIdShopify]).then(() => {
      return this.orderProducts(id).delete({ id: orderProductId });
    });
  }

  async addOrderChip(id: typeof OrderInfo.prototype.id, chip: Product & LineItemToAdd): Promise<OrderChip> {
    // TODO: Maybe check if LineItem variantId is chip or not (same with product above)
    const { variantId, quantity, customAttributes } = chip;
    const orderInfo = await this.findById(id);
    const flatten = (attrs: CustomAttribute[]) => attrs.reduce((acc, attr) => ({ ...acc, [attr.key]: attr.value }), {})
    const flattenedAttrs = flatten(customAttributes as CustomAttribute[]);
    return this.shopify.checkout.addLineItems(orderInfo.checkoutIdClient, [{ variantId, quantity, customAttributes }]).then(async (res) => {
      const matchingAttrs = (item: LineItem) => {
        // @ts-expect-error NOTE: Shopify types not updated
        return item.customAttributes.every((attr: { key: string; value: string; }) => attr.key in flattenedAttrs && attr.value === flattenedAttrs[attr.key]);
      }
      const lineItemId = res.lineItems.find((item) => matchingAttrs(item))?.id;

      const material: Material = chip.customAttributes ? chip.customAttributes.find((attr) => attr.key === 'material')?.value as Material : '' as Material;
      const fileName = chip.customAttributes ? chip.customAttributes.find((attr) => attr.key === 'fileName')?.value : '';
      const wcpa = chip.customAttributes ? chip.customAttributes.find((attr) => attr.key === 'wcpa')?.value : '';

      const fileRepository = await this.fileInfoRepositoryGetter();
      const fileInfo = await fileRepository.findOne({ where: { fileName } });

      const customerRepository = await this.customerRepositoryGetter();
      const customer = await customerRepository.findById(orderInfo.customerId);

      const data: DTO<OrderChip> = {
        orderInfoId: id,
        productIdShopify: chip.id,
        variantIdShopify: chip.variants[0].id,
        lineItemIdShopify: lineItemId,
        name: chip.title,
        description: chip.description,
        quantity: chip.quantity,
        // @ts-expect-error NOTE: Shopify types not updated
        price: parseFloat(chip.variants[0].price.amount),
        otherDetails: JSON.stringify(flattenedAttrs),
        process: material,
        coverPlate: wcpa,
        lastUpdated: new Date().toISOString(),
        fileInfoId: fileInfo?.id,
        // workerId,
        // workerName: `edrop ${workerUsername}`,
        customerName: `${customer.firstName} ${customer.lastName}`,
      };
      // Automatically assign worker to order
      switch (material) {
        case Material.Glass:
          data.workerName = 'glassfab';
          break;
        case Material.Paper:
          data.workerName = 'paperfab';
          break;
        case Material.PCB:
          data.workerName = 'pcbfab';
          break;
      }

      const userRepository = await this.userRepositoryGetter();
      const user = await userRepository.findOne({ where: { username: data.workerName } });

      const foundryWorkerRepository = await this.foundryWorkerRepositoryGetter();
      const foundryWorker = await foundryWorkerRepository.findOne({ where: { userId: user?.id } });

      data.workerId = foundryWorker?.id;

      return this.orderChips(id).find({ where: { productIdShopify: chip.id, variantIdShopify: chip.variants[0].id, otherDetails: data.otherDetails, } }).then(orderChips => {
        if (orderChips.length >= 1) {
          // Already existing entry for same product in order -> consolidate
          const totalQuantity = orderChips.reduce((acc, curr) => acc + curr.quantity, 0);
          for (let i = 1; i < orderChips.length; i++) {
            this.orderChips(id).delete({ id: orderChips[i].id });
          }
          this.orderChips(id).patch({ quantity: totalQuantity + data.quantity }, { id: orderChips[0].id });
          return this.orderChips(id).find({ where: { id: orderChips[0].id } }).then(orderChips => orderChips[0]);
        } else {
          return this.orderChips(id).create(data);
        }
      });
    });
  }

  async updateOrderChip(id: typeof OrderInfo.prototype.id, orderChipId: typeof OrderChip.prototype.id, orderChip: Partial<OrderChip>): Promise<OrderChip> {
    const orderInfo = await this.findById(id);
    const lineItemsToUpdate = [{ id: orderChip.lineItemIdShopify, quantity: orderChip.quantity }];
    return this.shopify.checkout.updateLineItems(orderInfo.checkoutIdClient, lineItemsToUpdate).then((res) => {
      return this.orderChips(id).patch(orderChip, { id: orderChipId })
    }).then(() => {
      return this.orderChips(id).find({ where: { id: orderChipId } }).then(orderChips => orderChips[0]);
    });
  }

  async deleteOrderChip(id: typeof OrderInfo.prototype.id, orderChipId: typeof OrderChip.prototype.id): Promise<void> {
    const orderInfo = await this.findById(id);
    const orderChips = await this.orderChips(id).find({ where: { id: orderChipId }});
    const orderChip = orderChips[0];
    this.shopify.checkout.removeLineItems(orderInfo.checkoutIdClient, [orderChip.lineItemIdShopify]).then(() => {
      return this.orderChips(id).delete({ id: orderChipId });
    });
  }

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
      this.findOne({ where: { checkoutToken: body.checkout_token } })
        .then(async (orderInfoInstance) => {
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
