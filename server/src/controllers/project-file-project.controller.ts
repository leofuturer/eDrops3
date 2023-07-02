import {
  repository,
} from '@loopback/repository';
import { ProjectFileRepository } from '../repositories';

export class ProjectFileProjectController {
  constructor(
    @repository(ProjectFileRepository)
    public projectFileRepository: ProjectFileRepository,
  ) { }

  // @get('/project-files/{id}/project', {
  //   responses: {
  //     '200': {
  //       description: 'Project belonging to ProjectFile',
  //       content: {
  //         'application/json': {
  //           schema: {type: 'array', items: getModelSchemaRef(Project)},
  //         },
  //       },
  //     },
  //   },
  // })
  // async getProject(
  //   @param.path.number('id') id: typeof ProjectFile.prototype.id,
  // ): Promise<Project> {
  //   return this.projectFileRepository.project(id);
  // }
}
