import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyThroughRepositoryFactory,
} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {PostComment, PostCommentRelations, CommentLink} from '../models';
import {CommentLinkRepository} from './comment-link.repository';

export class PostCommentRepository extends DefaultCrudRepository<
  PostComment,
  typeof PostComment.prototype.id,
  PostCommentRelations
> {
  public readonly postComments: HasManyThroughRepositoryFactory<
    PostComment,
    typeof PostComment.prototype.id,
    CommentLink,
    typeof PostComment.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @repository.getter('CommentLinkRepository')
    protected commentLinkRepositoryGetter: Getter<CommentLinkRepository>,
  ) {
    super(PostComment, dataSource);
    this.postComments = this.createHasManyThroughRepositoryFactoryFor(
      'postComments',
      Getter.fromValue(this),
      commentLinkRepositoryGetter,
    );
    this.registerInclusionResolver(
      'postComments',
      this.postComments.inclusionResolver,
    );
  }
}
