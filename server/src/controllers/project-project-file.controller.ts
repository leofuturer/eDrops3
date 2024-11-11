import { inject } from '@loopback/core';
import {
  CountSchema,
  Filter,
  repository
} from '@loopback/repository';
import {
  del,
  ExpressRequestHandler,
  get,
  getModelSchemaRef, oas, param,
  patch,
  post,
  Request,
  requestBody,
  Response,
  RestBindings
} from '@loopback/rest';
import { ProjectFile, User } from '../models';
import {
  ProjectFileRepository,
  ProjectRepository,
  UserRepository
} from '../repositories';
import { FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY } from '../services';
import { authenticate } from '@loopback/authentication';

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

  @get('/projects/{id}/project-files', {
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

  // requested when you add an image (before you create the post)
  @authenticate('jwt')
  @post('/users/{id}/project-images', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProjectFile)}},
      },
    },
  })
  async imageUpload(
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
            process.env.NODE_ENV !== 'production'
              ? await this.projectFileRepository.uploadFileDisk(
                  request,
                  response,
                  username as string,
                  id as string,
                  "image"
                )
              : await this.projectFileRepository.uploadFileS3(
                  request,
                  response,
                  username as string,
                  id as string,
                  "image"
                );
          // console.log(res);
          resolve(res);
        }
      });
    });
  }

  // same as /project-images but for dxfs
  @authenticate('jwt')
  @post('/users/{id}/project-files', {
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
            process.env.NODE_ENV !== 'production'
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
  @get('/users/{id}/project-files/{fileId}', {
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
    return process.env.NODE_ENV !== 'production'
      ? this.projectFileRepository.downloadFileDisk(filename, response)
      : this.projectFileRepository.downloadFileS3(filename, response);
  }

  @oas.response.file()
  @get('/project-files/{fileId}/download', {
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
  async downloadProjectFile(
    @param.path.number('fileId') fileId: typeof ProjectFile.prototype.id,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Response> {
    const filename = await this.projectFileRepository
      .findById(fileId)
      .then(file => {
        return file.containerFileName;
      });
    return process.env.NODE_ENV !== 'production'
      ? this.projectFileRepository.downloadFileDisk(filename, response)
      : this.projectFileRepository.downloadFileS3(filename, response);
  }

  @patch('/users/{id}/project-files/{fileId}', {
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

  @del('/users/{id}/project-files/{fileId}', {
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
    return this.projectFileRepository.deleteById(fileId);
  }
}
