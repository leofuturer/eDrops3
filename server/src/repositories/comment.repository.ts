import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyThroughRepositoryFactory,
} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {Comment, CommentRelations, CommentLink} from '../models';
import { CommentLinkRepository } from './comment-link.repository';

export class CommentRepository extends DefaultCrudRepository<
  Comment,
  typeof Comment.prototype.id,
  CommentRelations
> {
  public readonly comments: HasManyThroughRepositoryFactory<
    Comment,
    typeof Comment.prototype.id,
    CommentLink,
    typeof Comment.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    // @repository.getter('CommentLinkRepository')
    // protected CommentLinkRepositoryGetter: Getter<CommentLinkRepository>,
  ) {
    super(Comment, dataSource);
    // this.comments = this.createHasManyThroughRepositoryFactoryFor(
    //   'Comments',
    //   Getter.fromValue(this),
    //   CommentLinkRepositoryGetter,
    // );
    // this.registerInclusionResolver(
    //   'Comments',
    //   this.comments.inclusionResolver,
    // );
  }
}
