import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { Filter, FilterExcludingWhere, repository } from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
  HttpErrors,
  RestBindings,
  Request,
} from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
import { FoundryWorker, User } from '../models';
import { FoundryWorkerRepository, UserRepository } from '../repositories';
import { DTO } from '../lib/types/model';

export class FoundryWorkerController {
  constructor(
    @repository(FoundryWorkerRepository)
    public foundryWorkerRepository: FoundryWorkerRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(SecurityBindings.USER, { optional: true })
    public user: UserProfile,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) { }

  @post('/foundry-workers')
  @response(200, {
    description: 'FoundryWorker model instance',
    content: { 'application/json': { schema: getModelSchemaRef(FoundryWorker) } },
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
    foundryWorker: DTO<FoundryWorker & User>,
  ): Promise<FoundryWorker> {
    return this.foundryWorkerRepository.createFoundryWorker(foundryWorker, this.request.headers.origin);
  }

  @get('/foundry-workers')
  @response(200, {
    description: 'Array of FoundryWorker model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FoundryWorker, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(FoundryWorker) filter?: Filter<FoundryWorker>,
  ): Promise<FoundryWorker[]> {
    return this.foundryWorkerRepository.find({ ...filter, include: ['user'] });
  }

  @get('/foundry-workers/{id}')
  @response(200, {
    description: 'FoundryWorker model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FoundryWorker, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(FoundryWorker, { exclude: 'where' })
    filter?: FilterExcludingWhere<FoundryWorker>,
  ): Promise<FoundryWorker> {
    return this.foundryWorkerRepository.findById(id, { include: ['user'], ...filter });
  }

  @del('/foundry-workers/{id}')
  @response(204, {
    description: 'FoundryWorker DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.foundryWorkerRepository.deleteFoundryWorker(id);
  }

  @patch('/foundry-workers/{id}')
  @response(204, {
    description: 'FoundryWorker PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoundryWorker, { partial: true }),
        },
      },
    })
    foundryWorker: FoundryWorker,
  ): Promise<void> {
    await this.foundryWorkerRepository.updateById(id, foundryWorker);
  }
}
