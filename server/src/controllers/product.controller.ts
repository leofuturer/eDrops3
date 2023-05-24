import { get, param, response } from "@loopback/rest";
import { Client, Product, buildClient } from 'shopify-buy';
import Products from '../lib/constants/productConstants';

export class ProductController {
  private client: Client;
  constructor() {
    this.client = buildClient({
      storefrontAccessToken: process.env.SHOPIFY_TOKEN as string,
      domain: process.env.SHOPIFY_DOMAIN as string,
    });
  }

  @get('/products')
  @response(200, {
    description: 'Retrieve items',
    content: {
      'application/json': {
        schema: {
          type: 'array',
        },
      },
    },
  })
  async returnAllItems(): Promise<Product[]> {
    const productIds = [
      Products.CONTROLSYSID,
      Products.PCBCHIPID,
      Products.TESTBOARDID,
    ];
    // console.log(productIds);
    return this.client.product
      .fetchMultiple(productIds)
      .then((res: Product[]) => {
        return res.map(r => {
          return {
            ...r,
            id: Buffer.from(r.id as string, 'utf-8').toString('base64'),
            variants: r.variants.map(variant => {
              return {
                ...variant,
                id: Buffer.from(variant.id as string, 'utf-8').toString(
                  'base64',
                ),
              };
            }),
          };
        });
      })
      .catch((err: Error) => {
        console.log(err);
        return [];
      });
  }

  @get('/products/{id}')
  @response(200, {
    description: 'Retrieve one item',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async returnOneItem(
    @param.path.string('id') productId: string,
  ): Promise<Product> {
    return this.client.product
      .fetch(productId)
      .then((res: Product) => {
        console.log(res);
        return {
          ...res,
          id: Buffer.from(res.id as string, 'utf-8').toString('base64'),
          variants: res.variants.map(variant => {
            return {
              ...variant,
              id: Buffer.from(variant.id as string, 'utf-8').toString('base64'),
            };
          }),
        };
      })
      .catch((err: Error) => {
        console.log(err);
        return {} as Product;
      });
  }
}
