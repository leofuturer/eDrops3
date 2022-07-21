import { inject, Getter} from '@loopback/core';
import { DefaultCrudRepository, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import { MysqlDsDataSource } from '../datasources';
import { User, UserRelations, SavedPost, SavedProject, UserProfile, Post, Project} from '../models';
import {SavedPostRepository} from './saved-post.repository';
import {SavedProjectRepository} from './saved-project.repository';
import {UserProfileRepository} from './user-profile.repository';
import {PostRepository} from './post.repository';
import {ProjectRepository} from './project.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly savedPosts: HasManyRepositoryFactory<SavedPost, typeof User.prototype.id>;

  public readonly savedProjects: HasManyRepositoryFactory<SavedProject, typeof User.prototype.id>;

  public readonly userProfile: HasOneRepositoryFactory<UserProfile, typeof User.prototype.id>;

  public readonly posts: HasManyRepositoryFactory<Post, typeof User.prototype.id>;

  public readonly projects: HasManyRepositoryFactory<Project, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource, @repository.getter('SavedPostRepository') protected savedPostRepositoryGetter: Getter<SavedPostRepository>, @repository.getter('SavedProjectRepository') protected savedProjectRepositoryGetter: Getter<SavedProjectRepository>, @repository.getter('UserProfileRepository') protected userProfileRepositoryGetter: Getter<UserProfileRepository>, @repository.getter('PostRepository') protected postRepositoryGetter: Getter<PostRepository>, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>,
  ) {
    super(User, dataSource);
    this.projects = this.createHasManyRepositoryFactoryFor('projects', projectRepositoryGetter,);
    this.registerInclusionResolver('projects', this.projects.inclusionResolver);
    this.posts = this.createHasManyRepositoryFactoryFor('posts', postRepositoryGetter,);
    this.registerInclusionResolver('posts', this.posts.inclusionResolver);
    this.userProfile = this.createHasOneRepositoryFactoryFor('userProfile', userProfileRepositoryGetter);
    this.registerInclusionResolver('userProfile', this.userProfile.inclusionResolver);
    this.savedProjects = this.createHasManyRepositoryFactoryFor('savedProjects', savedProjectRepositoryGetter,);
    this.registerInclusionResolver('savedProjects', this.savedProjects.inclusionResolver);
    this.savedPosts = this.createHasManyRepositoryFactoryFor('savedPost', savedPostRepositoryGetter,);
    this.registerInclusionResolver('savedPost', this.savedPosts.inclusionResolver);
  }
}
