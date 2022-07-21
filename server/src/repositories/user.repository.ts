import { inject, Getter} from '@loopback/core';
import { DefaultCrudRepository, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import { MysqlDsDataSource } from '../datasources';
import { User, UserRelations, SavedPost, SavedProject, UserProfile} from '../models';
import {SavedPostRepository} from './saved-post.repository';
import {SavedProjectRepository} from './saved-project.repository';
import {UserProfileRepository} from './user-profile.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly savedPosts: HasManyRepositoryFactory<SavedPost, typeof User.prototype.id>;

  public readonly savedProjects: HasManyRepositoryFactory<SavedProject, typeof User.prototype.id>;

  public readonly userProfile: HasOneRepositoryFactory<UserProfile, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource, @repository.getter('SavedPostRepository') protected savedPostRepositoryGetter: Getter<SavedPostRepository>, @repository.getter('SavedProjectRepository') protected savedProjectRepositoryGetter: Getter<SavedProjectRepository>, @repository.getter('UserProfileRepository') protected userProfileRepositoryGetter: Getter<UserProfileRepository>,
  ) {
    super(User, dataSource);
    this.userProfile = this.createHasOneRepositoryFactoryFor('userProfile', userProfileRepositoryGetter);
    this.registerInclusionResolver('userProfile', this.userProfile.inclusionResolver);
    this.savedProjects = this.createHasManyRepositoryFactoryFor('savedProjects', savedProjectRepositoryGetter,);
    this.registerInclusionResolver('savedProjects', this.savedProjects.inclusionResolver);
    this.savedPosts = this.createHasManyRepositoryFactoryFor('savedPost', savedPostRepositoryGetter,);
    this.registerInclusionResolver('savedPost', this.savedPosts.inclusionResolver);
  }
}
