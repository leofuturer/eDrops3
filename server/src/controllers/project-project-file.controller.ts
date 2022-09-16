import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  oas,
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
import {Project, ProjectFile, User} from '../models';
import {
  ProjectFileRepository,
  ProjectRepository,
  UserRepository,
} from '../repositories';
import {FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY} from '../services';

export class ProjectProjectFileController {
  constructor(
    @repository(ProjectRepository)
    protected projectRepository: ProjectRepository,
    @repository(ProjectFileRepository)
    protected projectFileRepository: ProjectFileRepository,
    @repository(UserRepository)
    protected userRepository: UserRepository,
    @inject(FILE_UPLOAD_SERVICE) private handler: ExpressRequestHandler,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
  ) {}

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

  @post('/users/{id}/projectFiles', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProjectFile)}},
      },
    },
  })
  async fileUpload(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    const username = await this.userRepository.findById(id).then(user => {
      return user.username;
    });
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, async (err: unknown) => {
        if (err) reject(err);
        else {
          const res =
            false
              ? await this.projectFileRepository.uploadFileDisk(
                  request,
                  response,
                  username as string,
                  id as string
                )
              : await this.projectFileRepository.uploadFileS3(
                  request,
                  response,
                  username as string,
                  id as string
                );
          // console.log(res);
          resolve(res);
        }
      });
    });
  }

  @oas.response.file()
  @get('/users/{id}/projectFiles/{fileId}', {
    responses: {
      '200': {
        description: 'Download a file',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProjectFile)},
          },
        },
      },
    },
  })
  async downloadFile(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('fileId') fileId: typeof ProjectFile.prototype.id,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Response> {
    const filename = await this.projectFileRepository
      .findById(fileId)
      .then(file => {
        return file.containerFileName;
      });
    return false
      ? this.projectFileRepository.downloadFileDisk(filename, response)
      : this.projectFileRepository.downloadFileS3(filename, response);
  }

  @patch('/users/{id}/projectFiles/{fileId}', {
    responses: {
      '200': {
        description: 'Project.ProjectFile PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('fileId') fileId: typeof ProjectFile.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectFile, {partial: true}),
        },
      },
    })
    projectFile: Partial<ProjectFile>,
  ): Promise<void> {
    return this.projectFileRepository.updateById(fileId, projectFile);
  }

  @del('/users/{id}/projectFiles/{fileId}', {
    responses: {
      '200': {
        description: 'Project.ProjectFile DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: typeof User.prototype.id,
    @param.path.number('fileId') fileId: typeof ProjectFile.prototype.id,
  ): Promise<void> {
    return this.projectFileRepository.updateById(fileId, { isDeleted: true });
  }
}
