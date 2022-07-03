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
import {FoundryWorker, User} from '../models';
import {FoundryWorkerRepository} from '../repositories';

export class FoundryWorkerController {
  constructor(
    @repository(FoundryWorkerRepository)
    public foundryWorkerRepository : FoundryWorkerRepository,
  ) {}

  @post('/foundryWorkers')
  @response(200, {
    description: 'FoundryWorker model instance',
    content: {'application/json': {schema: getModelSchemaRef(FoundryWorker)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoundryWorker, {
            title: 'NewFoundryWorker',
            exclude: ['id'],
          }),
        },
      },
    })
    foundryWorker: Omit<FoundryWorker & User, 'id'>,
  ): Promise<FoundryWorker> {
    return this.foundryWorkerRepository.createFoundryWorker(foundryWorker);
  }

  @get('/foundryWorkers')
  @response(200, {
    description: 'Array of FoundryWorker model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FoundryWorker, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(FoundryWorker) filter?: Filter<FoundryWorker>,
  ): Promise<FoundryWorker[]> {
    return this.foundryWorkerRepository.find(filter);
  }

  @get('/foundryWorkers/{id}')
  @response(200, {
    description: 'FoundryWorker model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FoundryWorker, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(FoundryWorker, {exclude: 'where'}) filter?: FilterExcludingWhere<FoundryWorker>
  ): Promise<FoundryWorker> {
    return this.foundryWorkerRepository.findById(id, filter);
  }

  @del('/foundryWorkers/{id}')
  @response(204, {
    description: 'FoundryWorker DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.foundryWorkerRepository.deleteById(id);
  }

  @patch('/foundryWorkers/{id}')
  @response(204, {
    description: 'FoundryWorker PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoundryWorker, {partial: true}),
        },
      },
    })
    foundryWorker: FoundryWorker,
  ): Promise<void> {
    await this.foundryWorkerRepository.updateById(id, foundryWorker);
  }

  @post('/foundryWorkers/login')
  @response(200, {
    description: 'FoundryWorker LOGIN success',
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoundryWorker, {
            title: 'NewFoundryWorker',
            exclude: ['id'],
          }),
        },
      },
    })
    foundryWorker: Omit<FoundryWorker, 'id'>,
  ): Promise<void> {
    return;
    // return this.foundryWorkerRepository.login();
  }

  @post('/foundryWorkers/logout')
  @response(200, {
    description: 'FoundryWorker LOGOUT success',
  })
  async logout(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoundryWorker, {
            title: 'NewFoundryWorker',
            exclude: ['id'],
          }),
        },
      },
    })
    foundryWorker: Omit<FoundryWorker, 'id'>,
  ): Promise<void> {
    return;
    // return this.foundryWorkerRepository.logout();
  }

  @post('/api/foundryWorkers/reset')
  @response(200, {
    description: 'FoundryWorker RESET success',
  })
  async reset(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoundryWorker, {
            title: 'NewFoundryWorker',
            exclude: ['id'],
          }),
        },
      },
    })
    foundryWorker: Omit<FoundryWorker, 'id'>,
  ): Promise<void> {
    return;
    // return this.foundryWorkerRepository.reset();
  }

  @post('/foundryWorkers/change-password')
  @response(200, {
    description: 'FoundryWorker CHANGE PASSWORD success',
  })
  async changePassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoundryWorker, {
            title: 'NewFoundryWorker',
            exclude: ['id'],
          }),
        },
      },
    })
    foundryWorker: Omit<FoundryWorker, 'id'>,
  ): Promise<void> {
    return;
    // return this.foundryWorkerRepository.changePassword();
  }

  @post('/foundryWorkers/reset-password')
  @response(200, {
    description: 'FoundryWorker RESET PASSWORD success',
  })
  async resetPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoundryWorker, {
            title: 'NewFoundryWorker',
            exclude: ['id'],
          }),
        },
      },
    })
    foundryWorker: Omit<FoundryWorker, 'id'>,
  ): Promise<void> {
    return;
    // return this.foundryWorkerRepository.resetPassword();
  }

  @get('/foundryWorkers/{id}/downloadFile')
  @response(200, {
    description: 'FoundryWorker DOWNLOAD FILE success',
  })
  async downloadFile(
    @param.path.string('id') id: string,
    @param.query.string('fileName') fileName: string,
  ): Promise<void> {
    return;
    // return this.foundryWorkerRepository.downloadFile();
  }

  @post('/foundryWorkers/getWorkerID')
  @response(200, {
    description: 'FoundryWorker GET WORKER ID success',
  })
  async getWorkerID(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoundryWorker, {
            title: 'NewFoundryWorker',
            exclude: ['id'],
          }),
        },
      },
    })
    foundryWorker: Omit<FoundryWorker, 'id'>,
  ): Promise<void> {
    return;
    // return this.foundryWorkerRepository.getWorkerID();
  } 
}
