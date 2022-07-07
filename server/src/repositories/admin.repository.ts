import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {MysqlDsDataSource} from '../datasources';
import {Admin, AdminRelations, User} from '../models';
import {UserRepository} from './user.repository';
import {genSalt, hash} from 'bcryptjs';

export class AdminRepository extends DefaultCrudRepository<
  Admin,
  typeof Admin.prototype.id,
  AdminRelations
> {
  public readonly user: BelongsToAccessor<User, typeof Admin.prototype.id>;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Admin, dataSource);
    // this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    // this.registerInclusionResolver('user', this.user.inclusionResolver);
  }

  async createAdmin(admin: Omit<Admin & User, 'id'>): Promise<Admin> {
    // Create user first
    const hashedPassword = await hash(admin.password, await genSalt());
    const userData = {
      realm: admin.realm,
      username: admin.username,
      password: hashedPassword,
      userType: 'admin',
      email: admin.email,
      emailVerified: admin.emailVerified,
      verificationToken: admin.verificationToken,
    };
    const userRepository = await this.userRepositoryGetter();
    const userInstance = await userRepository.create(userData);
    // Create admin with relation to user
    const adminData = {
      ...userInstance,
      phoneNumber: admin.phoneNumber,
      // userId: userInstance.id,
    };
    const adminInstance = await this.create(adminData);
    return adminInstance;
  }
}
