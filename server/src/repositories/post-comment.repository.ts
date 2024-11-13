import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyThroughRepositoryFactory,
} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {PostComment, PostCommentRelations, PostCommentLink} from '../models';
import {PostCommentLinkRepository} from './post-comment-link.repository';

export class PostCommentRepository extends DefaultCrudRepository<
  PostComment,
  typeof PostComment.prototype.id,
  PostCommentRelations
> {
  public readonly postComments: HasManyThroughRepositoryFactory<
    PostComment,
    typeof PostComment.prototype.id,
    PostCommentLink,
    typeof PostComment.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @repository.getter('PostCommentLinkRepository')
    protected postCommentLinkRepositoryGetter: Getter<PostCommentLinkRepository>,
  ) {
    super(PostComment, dataSource);
    this.postComments = this.createHasManyThroughRepositoryFactoryFor(
      'postComments',
      Getter.fromValue(this),
      postCommentLinkRepositoryGetter,
    );
    this.registerInclusionResolver(
      'postComments',
      this.postComments.inclusionResolver,
    );
  }
}
