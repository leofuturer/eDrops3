import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  Response,
  response,
  RestBindings,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {compare, genSalt, hash} from 'bcryptjs';
import {
  Credentials,
  JWTService,
  MyUserService,
  TokenServiceBindings,
  UserServiceBindings,
} from '../components/jwt-authentication';
import {User} from '../models';
import {UserRepository} from '../repositories';

const CredentialsSchema: SchemaObject = {
  type: 'object',
  oneOf: [
    {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: {type: 'string', minLength: 4},
        password: {type: 'string', minLength: 8},
      },
    },
    {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {type: 'string', format: 'email'},
        password: {type: 'string', minLength: 8},
      },
    },
  ],
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUser: User,
  ): Promise<User> {
    const hashedPassword = await hash(newUser.password, await genSalt());

    const savedUser = await this.userRepository.create({
      username: newUser.username,
      password: hashedPassword,
      email: newUser.email,
      emailVerified: newUser.emailVerified,
      verificationToken: newUser.verificationToken,
      userType: newUser.userType,
    });

    return savedUser;
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    userBase: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, userBase);
  }

  @post('/users/login')
  @response(200, {
    description: 'User LOGIN success',
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{
    token: string;
    username: string;
    userId: string;
    userType: string;
  }> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    if (!user.emailVerified) {
      throw new HttpErrors.Unauthorized('Email is not verified');
    }

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {
      token,
      username: userProfile.name as string,
      userId: userProfile.id,
      userType: userProfile.userType,
    };
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @post('/users/logout')
  @response(200, {
    description: 'User LOGOUT success',
  })
  async logout(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    userBase: Omit<User, 'id'>,
  ): Promise<void> {
    return;
    // return this.userBaseRepository.logout(userBase);
  }

  @authenticate('jwt')
  @get('/users/api-token')
  @response(200, {
    description: 'Get API key and domain',
    content: {
      'application/json': {
        schema: {
          properties: {
            info: {
              properties: {
                // token: {
                //   type: 'string',
                // },
                // domain: {
                //   type: 'string',
                // },
                key: {
                  type: 'string',
                }
              },
            },
          },
        },
      },
    },
  })
  async getApiToken(): Promise<object> {
    return {
      info: {
        // token: process.env.SHOPIFY_TOKEN as string,
        // domain: process.env.SHOPIFY_DOMAIN as string,
        key: process.env.APP_PUSHER_API_KEY as string,
      },
    };
  }

  @post('/users/verify-email')
  @response(200, {
    description: 'Resend verification email',
  })
  async resendVerifyEmail(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              email: {
                type: 'string',
              },
            },
            required: ['email'],
          },
        },
      },
    })
    email: {
      email: string;
    },
  ): Promise<void> {
    // console.log(email);
    const user = await this.userRepository.findOne({
      where: {
        email: email.email,
      },
    });
    if (!user) {
      // Don't throw error if user not found to prevent email enumeration
      // throw new HttpErrors.NotFound('User not found');
    }
    else if (!user.emailVerified) {
      await this.userRepository.sendVerificationEmail(
        user as User,
      );
    }
  }

  // Only from email
  @get('/users/verify')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, { includeRelations: true }),
      },
    },
  })
  async verify(
    @param.query.string('userId') userId: string,
    @param.query.string('token') verificationToken: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<User> {
    const user = await this.userRepository.verifyEmail(
      userId,
      verificationToken,
    );
    // console.log(user);
    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }
    if (user.emailVerified) {
      response.redirect('/emailVerified');
    } else {
      response.redirect('/emailVerifyInvalid');
    }
    return user;
  }

  @post('/users/forgot-password')
  @response(200, {
    description: 'User RESET success',
  })
  async reset(
    @requestBody({
      content: {
        'application/json': {
          type: 'object',
          schema: {
            properties: {
              email: {type: 'string', format: 'email'},
            },
          },
        },
      },
    })
    data: {
      email: string;
    },
  ): Promise<void> {
    this.userRepository.sendResetEmail(data.email);
  }

  @authenticate('jwt')
  @post('/users/change-password')
  @response(200, {
    description: 'User CHANGE PASSWORD success',
  })
  async changePassword(
    @requestBody({
      content: {
        'application/json': {
          type: 'object',
          schema: {
            properties: {
              oldPassword: {type: 'string'},
              newPassword: {type: 'string'},
            },
          },
        },
      },
    })
    data: {oldPassword: string; newPassword: string},
    @inject(SecurityBindings.USER)
    userProfile: UserProfile,
  ): Promise<void> {
    const user = await this.userRepository.findById(userProfile.id);

    const passwordMatched = await compare(data.oldPassword, user.password);
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Wrong password');
    }
    await this.userRepository.changePassword(
      userProfile.id,
      data.newPassword,
    );
  }

  @post('/users/reset-password')
  @response(200, {
    description: 'User RESET PASSWORD success',
  })
  async resetPassword(
    @requestBody({
      content: {
        'application/json': {
          type: 'object',
          schema: {
            properties: {
              newPassword: {type: 'string'},
              accessToken: {type: 'string'},
            },
          },
        },
      },
    })
    data: {
      newPassword: string;
      accessToken: string;
    },
  ): Promise<void> {
    const id = await this.userRepository.verifyResetToken(data.accessToken);
    if (!id) {
      return;
    }
    await this.userRepository.changePassword(id, data.newPassword);
  }

  @post('/users/creds-taken')
  @response(200, {
    description: 'Check if creds are taken',
    content: {
      'application/json': {
        schema: {
          properties: {
            usernameTaken: {
              type: 'boolean',
            },
            emailTaken: {
              type: 'boolean',
            },
          },
        },
      },
    },
  })
  async checkCredsTaken(
    @requestBody() body: {username: string; email: string},
  ): Promise<{usernameTaken: boolean; emailTaken: boolean}> {
    if (!body.username && !body.email) {
      throw new HttpErrors.NotFound('Missing username and/or email keys');
    }

    const usernameTaken = await this.userRepository
      .findOne({
        where: {
          username: body.username,
        },
      })
      .then(user => {
        return !!user;
      })
      .catch(err => {
        throw new HttpErrors.InternalServerError(err);
      });

    const emailTaken = await this.userRepository
      .findOne({
        where: {
          email: body.email,
        },
      })
      .then(user => {
        return !!user;
      })
      .catch(err => {
        throw new HttpErrors.InternalServerError(err);
      });

    return {usernameTaken, emailTaken};
  }
}
