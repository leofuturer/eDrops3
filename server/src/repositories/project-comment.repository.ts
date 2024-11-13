import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyThroughRepositoryFactory,
} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {
  ProjectComment,
  ProjectCommentRelations,
  ProjectCommentLink,
} from '../models';
import {ProjectCommentLinkRepository} from './project-comment-link.repository';

export class ProjectCommentRepository extends DefaultCrudRepository<
  ProjectComment,
  typeof ProjectComment.prototype.id,
  ProjectCommentRelations
> {
  public readonly projectComments: HasManyThroughRepositoryFactory<
    ProjectComment,
    typeof ProjectComment.prototype.id,
    ProjectCommentLink,
    typeof ProjectComment.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @repository.getter('ProjectCommentLinkRepository')
    protected projectCommentLinkRepositoryGetter: Getter<ProjectCommentLinkRepository>,
  ) {
    super(ProjectComment, dataSource);
    this.projectComments = this.createHasManyThroughRepositoryFactoryFor(
      'projectComments',
      Getter.fromValue(this),
      projectCommentLinkRepositoryGetter,
    );
    this.registerInclusionResolver(
      'projectComments',
      this.projectComments.inclusionResolver,
    );
  }
}
