import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Project,
  ProjectLink,
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectProjectLinkController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
  ) {}

  // is this even used??
  @get('/projects/{id}/project-links', {
    responses: {
      '200': {
        description: 'Array of Project has many ProjectLink',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProjectLink)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ProjectLink>,
  ): Promise<ProjectLink[]> {
    return this.projectRepository.projectLinks(id).find(filter);
  }

  // this creates links when the project is created
  @post('/projects/{id}/project-links', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProjectLink)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Project.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectLink, {
            title: 'NewProjectLinkInProject',
            exclude: ['id'],
            optional: ['projectId']
          }),
        },
      },
    }) projectLink: Omit<ProjectLink, 'id'>,
  ): Promise<ProjectLink> {
    return this.projectRepository.projectLinks(id).create(projectLink);
  }

  // this isn't really necessary (unless we want to edit links, but that's not a priority if you have add/delete)
  @patch('/projects/{id}/project-links', {
    responses: {
      '200': {
        description: 'Project.ProjectLink PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectLink, {partial: true}),
        },
      },
    })
    projectLink: Partial<ProjectLink>,
    @param.query.object('where', getWhereSchemaFor(ProjectLink)) where?: Where<ProjectLink>,
  ): Promise<Count> {
    return this.projectRepository.projectLinks(id).patch(projectLink, where);
  }

  @post('/projects/{id}/project-links/delete', {
    responses: {
      '200': {
        description: 'Project.ProjectLink DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: "object"
          }
        },
      },
    }) projectLink: {"link": string}
  ): Promise<Count> {
    return this.projectRepository.projectLinks(id).delete({link: projectLink.link});
  }
}
