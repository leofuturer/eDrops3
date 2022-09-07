import { inject } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  ExpressRequestHandler,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {
  Project,
  ProjectFile,
} from '../models';
import {ProjectRepository} from '../repositories';
import { FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY } from '../services';

export class ProjectProjectFileController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
    @inject(FILE_UPLOAD_SERVICE) private handler: ExpressRequestHandler,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
  ) { }

  @get('/projects/{id}/projectFiles', {
    responses: {
      '200': {
        description: 'Array of Project has many ProjectFile',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProjectFile)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ProjectFile>,
  ): Promise<ProjectFile[]> {
    return this.projectRepository.projectFiles(id).find(filter);
  }

  @post('/projects/{id}/projectFiles', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProjectFile)}},
      },
    },
  })
  async fileUpload(
    @param.path.number('id') id: typeof Project.prototype.id,
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, async (err: unknown) => {
        if (err) reject(err);
        else {
          // console.log(request.files);
          resolve(
            process.env.NODE_ENV !== 'production'
              ? await this.projectRepository.uploadFileDisk(
                  request,
                  response
                )
              : await this.projectRepository.uploadFileS3(
                  request,
                  response,
                ),
          );
        }
      });
    });
  }

  @patch('/projects/{id}/projectFiles', {
    responses: {
      '200': {
        description: 'Project.ProjectFile PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectFile, {partial: true}),
        },
      },
    })
    projectFile: Partial<ProjectFile>,
    @param.query.object('where', getWhereSchemaFor(ProjectFile)) where?: Where<ProjectFile>,
  ): Promise<Count> {
    return this.projectRepository.projectFiles(id).patch(projectFile, where);
  }

  @del('/projects/{id}/projectFiles', {
    responses: {
      '200': {
        description: 'Project.ProjectFile DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProjectFile)) where?: Where<ProjectFile>,
  ): Promise<Count> {
    return this.projectRepository.projectFiles(id).delete(where);
  }
}
