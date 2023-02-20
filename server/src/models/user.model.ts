import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';
import {SavedPost} from './saved-post.model';
import {SavedProject} from './saved-project.model';
import {UserProfile} from './user-profile.model';
import {Post} from './post.model';
import {Project} from './project.model';
import {LikedPost} from './liked-post.model';
import {LikedProject} from './liked-project.model';
import {UserFollower} from './user-follower.model';

@model({
  settings: {
    description: 'Base user information',
    forceId: false,
    hiddenProperties: ['password', 'verificationToken', 'verificationTokenExpires'],
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: 1,
    defaultFn: 'uuidv4',
    limit: 36,
  })
  id?: string;

  @property({
    type: 'string',
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'boolean',
  })
  emailVerified?: boolean;

  @property({
    type: 'string',
  })
  verificationToken?: string;

  @property({
    type: 'date',
  })
  verificationTokenExpires?: Date;

  @property({
    type: 'string',
    required: false,
    default: 'customer',
  })
  userType?: 'customer' | 'worker' | 'admin';

  /** Community site information **/
  @hasMany(() => Post, {
    through: {
      model: () => SavedPost,
      keyFrom: 'userId',
      keyTo: 'postId',
    },
  })
  savedPosts?: Post[];

  @hasMany(() => Project, {
    through: {
      model: () => SavedProject,
      keyFrom: 'userId',
      keyTo: 'projectId',
    },
  })
  savedProjects?: Project[];

  @hasOne(() => UserProfile)
  userProfile?: UserProfile;

  @hasMany(() => Post)
  posts?: Post[];

  @hasMany(() => Project, {through: {model: () => LikedProject}})
  likedProjects?: Project[];

  @hasMany(() => User, {
    through: {
      model: () => UserFollower,
      keyFrom: 'userId',
      keyTo: 'followerId',
    },
  })
  followers?: User[];

  @hasMany(() => Project)
  projects?: Project[];

  @hasMany(() => Post, {
    through: {model: () => LikedPost, keyFrom: 'userId', keyTo: 'postId'},
  })
  likedPosts?: Post[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
