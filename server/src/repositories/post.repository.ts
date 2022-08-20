import { inject, Getter} from '@loopback/core';
import { DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import { MysqlDsDataSource } from '../datasources';
import { Post, PostRelations, PostComment} from '../models';
import {PostCommentRepository} from './post-comment.repository';

export class PostRepository extends DefaultCrudRepository<
  Post,
  typeof Post.prototype.id,
  PostRelations
> {

  public readonly postComments: HasManyRepositoryFactory<PostComment, typeof Post.prototype.id>;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource, @repository.getter('PostCommentRepository') protected postCommentRepositoryGetter: Getter<PostCommentRepository>,
  ) {
    super(Post, dataSource);
    this.postComments = this.createHasManyRepositoryFactoryFor('postComments', postCommentRepositoryGetter,);
    this.registerInclusionResolver('postComments', this.postComments.inclusionResolver);
  }

  async getFeaturedPosts() : Promise<Post[]> {
    return this.find({
      where: {
        datetime: {
          gte: new Date(Date.now() - (1000 * 60 * 60 * 24 * 7)),
        },
      },
      order: ['likes DESC'],
      limit: 4,
    })
  }
}
