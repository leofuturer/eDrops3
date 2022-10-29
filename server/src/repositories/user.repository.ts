import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  HasManyThroughRepository,
  HasManyThroughRepositoryFactory,
} from '@loopback/repository';
import {genSalt, hash} from 'bcryptjs';
import {createHash} from 'crypto';
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
import {
  EMAIL_HOSTNAME,
  EMAIL_PORT,
  EMAIL_SENDER,
} from '../lib/constants/emailConstants';
import SendGrid from '../services/send-grid.service';
import {JwtPayload, sign, verify} from 'jsonwebtoken';

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
    @inject('services.SendGrid')
    public sendGrid: SendGrid,
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

  async generateResetToken(user: User): Promise<string> {
    // const resetTokenHash = createHash('sha256')
    //   .update(user.password + Date.now().toString())
    //   .digest('hex');

    const payload = {
      id: user.id,
    };
    const resetToken = sign(
      payload,
      Buffer.from(process.env.JWT_SECRET ?? 't3stS3cr3teDrops123').toString(
        'base64',
      ),
      {
        expiresIn: 900, // 15 minutes
      },
    );
    const resetTokenEncoded = Buffer.from(resetToken).toString('base64');

    return resetTokenEncoded;
  }

  async sendResetEmail(email: string): Promise<void> {
    // Send reset email
    const user = await this.findOne({where: {email}});
    if (!user) {
      // throw new HttpErrors.NotFound('User not found');
      return;
    }
    const baseURL =
      process.env.NODE_ENV === 'production'
        ? `https://${EMAIL_HOSTNAME}`
        : `http://${EMAIL_HOSTNAME}:${EMAIL_PORT}`;

    const reset_token = await this.generateResetToken(user);
    const sendGridOptionsReset = {
      from: {
        email: EMAIL_SENDER,
      },
      personalizations: [
        {
          to: [
            {
              email: user.email,
            },
          ],
          dynamic_template_data: {
            link: `${baseURL}/resetPassword?access_token=${reset_token}`,
          },
        },
      ],
      template_id: 'd-9410fec18d0a46c8a8776ae03f68219d',
    };

    this.sendGrid.send(
      process.env.APP_EMAIL_API_KEY as string,
      sendGridOptionsReset,
    );
  }

  async verifyResetToken(token: string): Promise<string> {
    const tokenDecoded = Buffer.from(token, 'base64').toString('ascii');
    const payload = verify(
      tokenDecoded,
      Buffer.from(process.env.JWT_SECRET ?? 't3stS3cr3teDrops123').toString(
        'base64',
      ),
    ) as JwtPayload;
    return payload.id ?? '';
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await hash(newPassword, await genSalt());
    await this.updateById(userId, {password: hashedPassword});
  }
}
