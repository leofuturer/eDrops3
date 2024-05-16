import { Getter, inject } from '@loopback/core';
import {
  DefaultCrudRepository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory, HasOneRepositoryFactory, repository
} from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { genSalt, hash } from 'bcryptjs';
import { createHash } from 'crypto';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { MysqlDsDataSource } from '../datasources';
import {
  EMAIL_HOSTNAME,
  EMAIL_PORT,
  EMAIL_SENDER
} from '../lib/constants/emailConstants';
import { DTO } from '../lib/types/model';
import {
  LikedPost,
  LikedProject, Post,
  Project, SavedPost,
  SavedProject, User, UserFollower, UserProfile, UserRelations, PostComment, LikedComment} from '../models';
import SendGrid from '../services/send-grid.service';
import { LikedPostRepository } from './liked-post.repository';
import { LikedProjectRepository } from './liked-project.repository';
import { PostRepository } from './post.repository';
import { ProjectRepository } from './project.repository';
import { SavedPostRepository } from './saved-post.repository';
import { SavedProjectRepository } from './saved-project.repository';
import { UserFollowerRepository } from './user-follower.repository';
import { UserProfileRepository } from './user-profile.repository';
import {LikedCommentRepository} from './liked-comment.repository';
import {PostCommentRepository} from './post-comment.repository';

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

  public readonly likedComments: HasManyThroughRepositoryFactory<PostComment, typeof PostComment.prototype.id,
          LikedComment,
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
    public sendGrid: SendGrid, @repository.getter('LikedCommentRepository') protected likedCommentRepositoryGetter: Getter<LikedCommentRepository>, @repository.getter('PostCommentRepository') protected postCommentRepositoryGetter: Getter<PostCommentRepository>,
  ) {
    super(User, dataSource);
    this.likedComments = this.createHasManyThroughRepositoryFactoryFor('likedComments', postCommentRepositoryGetter, likedCommentRepositoryGetter,);
    this.registerInclusionResolver('likedComments', this.likedComments.inclusionResolver);
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

  async createUser(user: DTO<User>, baseURL: string = process.env.EMAIL_HOSTNAME as string) {
    const hashedPassword = await hash(user.password, await genSalt());
    const userData: Partial<User> = {
      id: user.id,
      username: user.username,
      password: hashedPassword,
      userType: user.userType,
      email: user.email,
      emailVerified: user.emailVerified,
      verificationToken: user.verificationToken,
    };
    const userInstance = await this.create(userData);
    if (!user.emailVerified) {
      await this.sendVerificationEmail(userInstance, baseURL);
    }
    return userInstance;
  }

  async createVerificationToken(userId: string): Promise<string> {
    const verificationTokenHash = createHash('sha256')
      .update(userId + Date.now().toString())
      .digest('hex');
    return this.updateById(userId, {
      verificationToken: verificationTokenHash,
      verificationTokenExpires: new Date(Date.now() + 600000),
    }).then(() => verificationTokenHash);
  }

  async sendVerificationEmail(user: User, baseURL: string = process.env.EMAIL_HOST as string): Promise<void> {
    const verificationTokenHash = await this.createVerificationToken(
      user.id as string,
    );

    // uncomment the next two lines to skip email verification
    // this.verifyEmail(user.id as string, verificationTokenHash);
    // exit(0);

    // const baseURL =
    //   process.env.NODE_ENV === 'production'
    //     ? `https://${EMAIL_HOSTNAME}`
    //     : `http://${EMAIL_HOSTNAME}:${EMAIL_PORT}`;

    const sendGridOptions = {
      personalizations: [
        {
          from: {
            email: EMAIL_SENDER,
          },
          to: [
            {
              email: user.email,
              // name: user.username,
            },
          ],
          // subject: '[eDroplets] Email Verification',
          dynamic_template_data: {
            username: user.username,
            // firstName: user.firstName,
            // lastName: user.lastName,
            text: "Thanks for registering to use eDroplets. Please verify your email by clicking on the following link:",
            verifyLink: `${baseURL}/api/users/verify?userId=${user.id}&token=${verificationTokenHash}`,
          }
        },
      ],
      template_id: "d-0fdd579fca2e4125a687db6e13be290d",
      from: {
        email: EMAIL_SENDER,
      },
      reply_to: {
        email: EMAIL_SENDER,
      },
    };

    this.sendGrid.send(
      process.env.APP_EMAIL_API_KEY as string,
      sendGridOptions,
    );
  }

  async verifyEmail(
    userId: string,
    verificationToken: string,
  ): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpErrors.NotFound('user not found');
    }
    const currentTime = new Date();
    return this.updateById(userId, {
      emailVerified:
        user?.verificationToken === verificationToken &&
        (user?.verificationTokenExpires ?? currentTime) > currentTime,
    }).then(
      async () => {
        // Update associated User instance
        await this.updateById(userId, {
          emailVerified:
            user?.verificationToken === verificationToken &&
            (user?.verificationTokenExpires ?? currentTime) > currentTime,
        });
        return this.findById(userId)
      }
    ).catch(err => {
      throw new HttpErrors.InternalServerError(err.message);
    });
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
      Buffer.from(process.env.JWT_SECRET ?? 't3stS3cr3teDroplets123').toString(
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
            link: `${baseURL}/reset-password?reset_token=${reset_token}`,
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
      Buffer.from(process.env.JWT_SECRET ?? 't3stS3cr3teDroplets123').toString(
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
