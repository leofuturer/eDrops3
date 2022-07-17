import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    validateUpsert: true,
    plural: 'orderItemBase',
    idInjection: true,
    mysql: {table: 'orderItemBase'}
  }
})
export class OrderItemBase extends Entity {
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
    description: 'Product ID generated by Shopify',
  })
  productIdShopify: string;

  @property({
    type: 'string',
    required: true,
    description: 'Variant ID generated by Shopify',
  })
  variantIdShopify: string;

  @property({
    type: 'string',
    required: true,
    description: 'Line item ID in checkout generated by Shopify',
  })
  lineItemIdShopify: string;

  @property({
    type: 'string',
    required: true,
    description: 'Name of product',
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    description: 'Product description generated by Shopify',
  })
  description: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'number',
    required: true,
    description: 'Cost per item for this variant',
  })
  price: number;

  @property({
    type: 'string',
  })
  otherDetails?: string;

  @property({
    type: 'number',
  })
  orderId?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<OrderItemBase>) {
    super(data);
  }
}

export interface OrderItemBaseRelations {
  // describe navigational properties here
}

export type OrderItemBaseWithRelations = OrderItemBase & OrderItemBaseRelations;
