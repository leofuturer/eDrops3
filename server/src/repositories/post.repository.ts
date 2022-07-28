import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MysqlDsDataSource } from '../datasources';
import { Post, PostRelations } from '../models';

export class PostRepository extends DefaultCrudRepository<
  Post,
  typeof Post.prototype.id,
  PostRelations
> {
  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
  ) {
    super(Post, dataSource);
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
