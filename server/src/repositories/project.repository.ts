import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {
  Project,
  ProjectRelations,
  ProjectFile,
  ProjectLink,
  ProjectComment,
} from '../models';
import {ProjectCommentRepository} from './project-comment.repository';
import {ProjectFileRepository} from './project-file.repository';
import {ProjectLinkRepository} from './project-link.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {
  public readonly projectFiles: HasManyRepositoryFactory<
    ProjectFile,
    typeof Project.prototype.id
  >;

  public readonly projectLinks: HasManyRepositoryFactory<
    ProjectLink,
    typeof Project.prototype.id
  >;

  public readonly projectComments: HasManyRepositoryFactory<
    ProjectComment,
    typeof Project.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @repository.getter('ProjectFileRepository')
    protected projectFileRepositoryGetter: Getter<ProjectFileRepository>,
    @repository.getter('ProjectLinkRepository')
    protected projectLinkRepositoryGetter: Getter<ProjectLinkRepository>,
    @repository.getter('ProjectCommentRepository')
    protected projectCommentRepositoryGetter: Getter<ProjectCommentRepository>,
  ) {
    super(Project, dataSource);
    this.projectLinks = this.createHasManyRepositoryFactoryFor(
      'projectLinks',
      projectLinkRepositoryGetter,
    );
    this.registerInclusionResolver(
      'projectLinks',
      this.projectLinks.inclusionResolver,
    );
    this.projectFiles = this.createHasManyRepositoryFactoryFor(
      'projectFiles',
      projectFileRepositoryGetter,
    );
    this.registerInclusionResolver(
      'projectFiles',
      this.projectFiles.inclusionResolver,
    );
    this.projectComments = this.createHasManyRepositoryFactoryFor(
      'projectComments',
      projectCommentRepositoryGetter,
    );
    this.registerInclusionResolver(
      'projectComments',
      this.projectComments.inclusionResolver,
    );
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return this.find({
      where: {
        datetime: {
          gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        },
      },
      order: ['likes DESC'],
      limit: 4,
    });
  }
}
