import {Entity, model, property, hasMany} from '@loopback/repository';
import {OrderProduct} from './order-product.model';
import {OrderChip} from './order-chip.model';

@model({
  settings: {
    validateUpsert: true,
    plural: 'orderInfos',
    idInjection: true,
    remoting: {
      sharedMethods: {
        '*': false,
        findById: true,
        find: true,
        'prototype.addOrderProductToCart': true,
        'prototype.addOrderChipToCart': true,
        newOrderCreated: true,
        'prototype.__get__orderProducts': true,
        'prototype.__get__orderChips': true
      }
    },
    mysql: {table: 'orderInfo'}
  }
})
export class OrderInfo extends Entity {
  @property({
    type: 'number',
    id: 1,
    generated: true,
    updateOnly: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    description: 'Checkout ID generated by js-buy-sdk',
  })
  checkoutIdClient: string;

  @property({
    type: 'string',
    required: true,
    description: 'Checkout token generated by Shopify js-buy-sdk, used to tie initial order creation with webhooks',
  })
  checkoutToken: string;

  @property({
    type: 'string',
    required: true,
    description: 'Checkout link generated by Shopify',
  })
  checkoutLink: string;

  @property({
    type: 'string',
    description: 'Order ID generated by Shopify',
  })
  orderInfoId?: string;

  @property({
    type: 'string',
    required: true,
    description: 'Time of order creation, as recorded by Shopify',
  })
  createdAt: string;

  @property({
    type: 'string',
    required: true,
    description: 'Time of last order modification',
  })
  lastModifiedAt: string;

  @property({
    type: 'string',
  })
  orderStatusURL?: string;

  @property({
    type: 'boolean',
    required: true,
    description: 'If false, represents current cart of customer',
  })
  orderComplete: boolean;

  @property({
    type: 'string',
    required: true,
    default: 'Order in progress',
  })
  status: string;

  @property({
    type: 'string',
  })
  fees_and_taxes?: string;

  @property({
    type: 'string',
  })
  subtotal_cost?: string;

  @property({
    type: 'string',
  })
  total_cost?: string;

  @property({
    type: 'string',
  })
  user_email?: string;

  @property({
    type: 'string',
  })
  sa_name?: string;

  @property({
    type: 'string',
    description: 'sa = shipping address',
  })
  sa_address1?: string;

  @property({
    type: 'string',
  })
  sa_address2?: string;

  @property({
    type: 'string',
  })
  sa_city?: string;

  @property({
    type: 'string',
  })
  sa_province?: string;

  @property({
    type: 'string',
  })
  sa_zip?: string;

  @property({
    type: 'string',
  })
  sa_country?: string;

  @property({
    type: 'string',
  })
  ba_name?: string;

  @property({
    type: 'string',
    description: 'ba = billing address',
  })
  ba_address1?: string;

  @property({
    type: 'string',
  })
  ba_address2?: string;

  @property({
    type: 'string',
  })
  ba_city?: string;

  @property({
    type: 'string',
  })
  ba_province?: string;

  @property({
    type: 'string',
  })
  ba_zip?: string;

  @property({
    type: 'string',
  })
  ba_country?: string;

  @property({
    type: 'string',
  })
  otherDetails?: string;

  @property({
    type: 'string',
  })
  customerId?: string;

  @property({
    type: 'number',
  })
  billingAddressId?: number;

  @property({
    type: 'number',
  })
  shippingAddressId?: number;

  @hasMany(() => OrderProduct, {keyTo: 'orderId'})
  orderProducts: OrderProduct[];

  @hasMany(() => OrderChip, {keyTo: 'orderId'})
  orderChips: OrderChip[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<OrderInfo>) {
    super(data);
  }
}

export interface OrderInfoRelations {
  // describe navigational properties here
}

export type OrderInfoWithRelations = OrderInfo & OrderInfoRelations;