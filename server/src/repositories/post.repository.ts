import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {Post, PostRelations, PostComment} from '../models';
import {PostCommentRepository} from './post-comment.repository';

export class PostRepository extends DefaultCrudRepository<
  Post,
  typeof Post.prototype.id,
  PostRelations
> {
  public readonly postComments: HasManyRepositoryFactory<
    PostComment,
    typeof Post.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @repository.getter('PostCommentRepository')
    protected postCommentRepositoryGetter: Getter<PostCommentRepository>,
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
    const LIMIT = 16;
    const latestPosts = await this.find({
      order: ['datetime DESC'],
      limit: LIMIT,
    });

    // Sort latest posts by likes
    const featuredPosts = latestPosts.sort((a, b) => {
      return b.likes - a.likes;
    }).slice(0, 4);
    
    return featuredPosts;
  }
}
