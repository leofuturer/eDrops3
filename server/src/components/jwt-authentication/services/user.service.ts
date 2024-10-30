// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-access-control-migration
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import { UserService } from '@loopback/authentication';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { securityId, UserProfile } from '@loopback/security';
import { compare } from 'bcryptjs';
import { User } from '../../../models/user.model';
import { UserRepository } from '../../../repositories/user.repository';

/**
 * A pre-defined type for user credentials. It assumes a user logs in
 * using the email and password. You can modify it if your app has different credential fields
 */
type UsernameCredentials = {
  email: never;
  username: string;
  password: string;
};

type EmailCredentials = {
  email: string;
  username: never;
  password: string;
};

export type Credentials = UsernameCredentials | EmailCredentials;

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const invalidCredentialsError = 'Invalid credentials';

    let foundUser;
    if (credentials.hasOwnProperty('email')) {
      foundUser = await this.userRepository.findOne({
        where: {email: credentials.email},
      });
    } else if (credentials.hasOwnProperty('username')) {
      foundUser = await this.userRepository.findOne({
        where: {username: credentials.username},
      });
    }
    else {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const passwordMatched = await compare(
      credentials.password,
      foundUser.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user?.id?.toString() as string,
      name: user.username,
      id: user.id,
      email: user.email,
      userType: user.userType,
    };
  }
}
