import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {Post, PostRelations, Comment} from '../models';
import {CommentRepository} from './comment.repository';

export class PostRepository extends DefaultCrudRepository<
  Post,
  typeof Post.prototype.id,
  PostRelations
> {
  public readonly postComments: HasManyRepositoryFactory<
    Comment,
    typeof Post.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @repository.getter('CommentRepository')
    protected postCommentRepositoryGetter: Getter<CommentRepository>,
  ) {
    super(Post, dataSource);
    this.postComments = this.createHasManyRepositoryFactoryFor(
      'postComments',
      postCommentRepositoryGetter,
    );
    this.registerInclusionResolver(
      'postComments',
      this.postComments.inclusionResolver,
    );
  }

  async getFeaturedPosts(): Promise<Post[]> {
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
