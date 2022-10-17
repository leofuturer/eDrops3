import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  HasManyThroughRepository,
  HasManyThroughRepositoryFactory,
} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {
  User,
  UserRelations,
  SavedPost,
  SavedProject,
  UserProfile,
  Post,
  Project,
  LikedPost,
  LikedProject,
  UserFollower,
} from '../models';
import {SavedPostRepository} from './saved-post.repository';
import {SavedProjectRepository} from './saved-project.repository';
import {UserProfileRepository} from './user-profile.repository';
import {PostRepository} from './post.repository';
import {ProjectRepository} from './project.repository';
import {LikedPostRepository} from './liked-post.repository';
import {LikedProjectRepository} from './liked-project.repository';
import {UserFollowerRepository} from './user-follower.repository';
import {genSalt, hash} from 'bcryptjs';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly savedPosts: HasManyThroughRepositoryFactory<
    Post,
    typeof Post.prototype.id,
    SavedPost,
    typeof User.prototype.id
  >;

  public readonly savedProjects: HasManyThroughRepositoryFactory<
    Project,
    typeof Project.prototype.id,
    SavedProject,
    typeof User.prototype.id
  >;

  public readonly userProfile: HasOneRepositoryFactory<
    UserProfile,
    typeof User.prototype.id
  >;

  public readonly posts: HasManyRepositoryFactory<
    Post,
    typeof User.prototype.id
  >;

  public readonly projects: HasManyRepositoryFactory<
    Project,
    typeof User.prototype.id
  >;

  public readonly likedPosts: HasManyThroughRepositoryFactory<
    Post,
    typeof Post.prototype.id,
    LikedPost,
    typeof User.prototype.id
  >;

  public readonly likedProjects: HasManyThroughRepositoryFactory<
    Project,
    typeof Project.prototype.id,
    LikedProject,
    typeof User.prototype.id
  >;

  public readonly followers: HasManyThroughRepositoryFactory<
    User,
    typeof User.prototype.id,
    UserFollower,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @repository.getter('SavedPostRepository')
    protected savedPostRepositoryGetter: Getter<SavedPostRepository>,
    @repository.getter('SavedProjectRepository')
    protected savedProjectRepositoryGetter: Getter<SavedProjectRepository>,
    @repository.getter('UserProfileRepository')
    protected userProfileRepositoryGetter: Getter<UserProfileRepository>,
    @repository.getter('PostRepository')
    protected postRepositoryGetter: Getter<PostRepository>,
    @repository.getter('ProjectRepository')
    protected projectRepositoryGetter: Getter<ProjectRepository>,
    @repository.getter('LikedPostRepository')
    protected likedPostRepositoryGetter: Getter<LikedPostRepository>,
    @repository.getter('LikedProjectRepository')
    protected likedProjectRepositoryGetter: Getter<LikedProjectRepository>,
    @repository.getter('UserFollowerRepository')
    protected userFollowerRepositoryGetter: Getter<UserFollowerRepository>,
  ) {
    super(User, dataSource);
    this.followers = this.createHasManyThroughRepositoryFactoryFor(
      'followers',
      Getter.fromValue(this),
      userFollowerRepositoryGetter,
    );
    this.registerInclusionResolver(
      'followers',
      this.followers.inclusionResolver,
    );
    this.likedProjects = this.createHasManyThroughRepositoryFactoryFor(
      'likedProjects',
      projectRepositoryGetter,
      likedProjectRepositoryGetter,
    );
    this.registerInclusionResolver(
      'likedProjects',
      this.likedProjects.inclusionResolver,
    );
    this.likedPosts = this.createHasManyThroughRepositoryFactoryFor(
      'likedPosts',
      postRepositoryGetter,
      likedPostRepositoryGetter,
    );
    this.registerInclusionResolver(
      'likedPosts',
      this.likedPosts.inclusionResolver,
    );
    this.projects = this.createHasManyRepositoryFactoryFor(
      'projects',
      projectRepositoryGetter,
    );
    this.registerInclusionResolver('projects', this.projects.inclusionResolver);
    this.posts = this.createHasManyRepositoryFactoryFor(
      'posts',
      postRepositoryGetter,
    );
    this.registerInclusionResolver('posts', this.posts.inclusionResolver);
    this.userProfile = this.createHasOneRepositoryFactoryFor(
      'userProfile',
      userProfileRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userProfile',
      this.userProfile.inclusionResolver,
    );
    this.savedProjects = this.createHasManyThroughRepositoryFactoryFor(
      'savedProjects',
      projectRepositoryGetter,
      savedProjectRepositoryGetter,
    );
    this.registerInclusionResolver(
      'savedProjects',
      this.savedProjects.inclusionResolver,
    );
    this.savedPosts = this.createHasManyThroughRepositoryFactoryFor(
      'savedPosts',
      postRepositoryGetter,
      savedPostRepositoryGetter,
    );
    this.registerInclusionResolver(
      'savedPosts',
      this.savedPosts.inclusionResolver,
    );
  }

  async createUser(user: Omit<User, 'id'>) {
    const hashedPassword = await hash(user.password, await genSalt());
    const userData: Partial<User> = {
      id: user.id,
      realm: user.realm,
      username: user.username,
      password: hashedPassword,
      userType: user.userType,
      email: user.email,
      emailVerified: user.emailVerified,
      verificationToken: user.verificationToken,
    };
    return this.create(userData);
  }
}
