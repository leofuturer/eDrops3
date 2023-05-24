import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import { Admin, OrderChip, User } from '../models';
import { AdminRepository, OrderInfoRepository, OrderProductRepository } from '../repositories';
import { DTO } from '../lib/types/model';

export class AdminController {
  constructor(
    @repository(AdminRepository)
    public adminRepository: AdminRepository,
    @repository(OrderProductRepository)
    public orderProduct: OrderProductRepository,
    // @repository(OrderChipRepository)
    // public orderChip: OrderChipRepository,
    @repository(OrderInfoRepository)
    public orderInfo: OrderInfoRepository,
    // @repository(FoundryWorkerRepository)
    // public foundryWorkerRepository: FoundryWorkerRepository,
  ) { }

  @post('/admins')
  @response(200, {
    description: 'Admin model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Admin) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    admin: DTO<Admin & User>,
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
          items: getModelSchemaRef(Admin, { includeRelations: true }),
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
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, { partial: true }),
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
        schema: getModelSchemaRef(Admin, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Admin, { exclude: 'where' })
    filter?: FilterExcludingWhere<Admin>,
  ): Promise<Admin> {
    return this.adminRepository.findById(id, { include: ['user'], ...filter});
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
          schema: getModelSchemaRef(Admin, { partial: true }),
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
    await this.adminRepository.deleteAdmin(id);
  }

  @get('/admins/chip-orders')
  @response(200, {
    description: 'Array of OrderChip model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
        },
      },
    },
  })
  async getChipOrders(
  ): Promise<OrderChip[]> {
    let allOrderChips: OrderChip[] = [];
    const completedOrders = await this.orderInfo.find({ include: [{ relation: 'orderChips' }], where: { orderComplete: true } });
    completedOrders.map((orderInfo) => {
      allOrderChips = allOrderChips.concat.apply(allOrderChips, orderInfo.orderChips);
    });

    return allOrderChips;
  }
}
