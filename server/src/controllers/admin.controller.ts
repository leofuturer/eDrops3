import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Admin, OrderProduct, User} from '../models';
import {AdminRepository, OrderProductRepository} from '../repositories';
import Products from '../lib/constants/productConstants';
import Client from 'shopify-buy';
import fetch from 'node-fetch';

// @ts-ignore
global.fetch = fetch;

const client = Client.buildClient({
  storefrontAccessToken: (process.env.SHOPIFY_STORE !== 'test' ? process.env.SHOPIFY_TOKEN : process.env.SHOPIFY_DOMAIN_TEST) as string,
  domain: (process.env.SHOPIFY_STORE !== 'test' ? process.env.SHOPIFY_DOMAIN : process.env.SHOPIFY_DOMAIN_TEST) as string,
});

export class AdminController {
  constructor(
    @repository(AdminRepository)
    public adminRepository: AdminRepository,
    @repository(OrderProductRepository)
    public orderProduct: OrderProductRepository,
  ) {}

  @post('/admins')
  @response(200, {
    description: 'Admin model instance',
    content: {'application/json': {schema: getModelSchemaRef(Admin)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {
            title: 'NewAdmin',
            exclude: ['id'],
          }),
        },
      },
    })
    admin: Omit<Admin & User, 'id'>,
  ): Promise<Admin> {
    return this.adminRepository.createAdmin(admin);
  }
  
  @get('/admins')
  @response(200, {
    description: 'Array of Admin model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Admin, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Admin) filter?: Filter<Admin>): Promise<Admin[]> {
    return this.adminRepository.find(filter);
  }

  @patch('/admins')
  @response(200, {
    description: 'Admin PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {partial: true}),
        },
      },
    })
    admin: Admin,
    @param.where(Admin) where?: Where<Admin>,
  ): Promise<Count> {
    return this.adminRepository.updateAll(admin, where);
  }

  @get('/admins/{id}')
  @response(200, {
    description: 'Admin model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Admin, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Admin, {exclude: 'where'})
    filter?: FilterExcludingWhere<Admin>,
  ): Promise<Admin> {
    return this.adminRepository.findById(id, filter);
  }

  @patch('/admins/{id}')
  @response(204, {
    description: 'Admin PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {partial: true}),
        },
      },
    })
    admin: Admin,
  ): Promise<void> {
    await this.adminRepository.updateById(id, admin);
  }

  @put('/admins/{id}')
  @response(204, {
    description: 'Admin PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() admin: Admin,
  ): Promise<void> {
    await this.adminRepository.replaceById(id, admin);
  }

  @del('/admins/{id}')
  @response(204, {
    description: 'Admin DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.adminRepository.deleteById(id);
  }

  @get('/admins/getItems')
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
  async returnAllItems(): Promise<Client.Product[]> {
    const productIds = [
      Products.CONTROLSYSID,
      Products.TESTBOARDID,
      Products.UNIVEWODCHIPID,
    ];
    console.log(productIds);
    return client.product
      .fetchMultiple(productIds)
      .then((res: Client.Product[]) => {
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

  @get('/admins/getOne')
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
    @param.query.string('productId') productId: string
  ): Promise<Client.Product | object> {
    return client.product
      .fetch(productId)
      .then((res: Client.Product) => {
        return {
          ...res,
          id: Buffer.from(res.id as string, 'utf-8').toString('base64'),
          variants: res.variants.map(variant => {
            return {
              ...variant,
              id: Buffer.from(variant.id as string, 'utf-8').toString(
                'base64',
              ),
            };
          }),
        };;
      })
      .catch((err: Error) => {
        console.log(err);
        return {};
      });
  }

  @get('/admins/getApi')
  @response(200, {
    description: 'Get API token',
    content: {
      'application/json': {
        schema: {
          properties: {
            info: {
              properties: {
                token: {
                  type: 'string',
                },
                domain: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async getApiToken(): Promise<object> {
    return {
      token: (process.env.SHOPIFY_STORE !== 'test' ? process.env.SHOPIFY_TOKEN : process.env.SHOPIFY_DOMAIN_TEST) as string,
      domain: (process.env.SHOPIFY_STORE !== 'test' ? process.env.SHOPIFY_DOMAIN : process.env.SHOPIFY_DOMAIN_TEST) as string,
    };
  }
}
