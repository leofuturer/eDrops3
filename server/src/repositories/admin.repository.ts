import { Getter, inject } from '@loopback/core';
import {
  BelongsToAccessor, DefaultCrudRepository,
  repository
} from '@loopback/repository';
import { genSalt, hash } from 'bcryptjs';
import { MysqlDsDataSource } from '../datasources';
import { DTO } from '../lib/types/model';
import { Admin, AdminRelations, User } from '../models';
import { UserRepository } from './user.repository';

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
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }

  async createAdmin(admin: DTO<Admin & User>): Promise<Admin> {
    // Create user first
    const hashedPassword = await hash(admin.password, await genSalt());
    const userData: Partial<User> = {
      id: admin.id,
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
    const adminData: Partial<Admin> = {
      id: userInstance.id,
      phoneNumber: admin.phoneNumber,
      userId: userInstance.id,
    };
    const adminInstance = await this.create(adminData);
    await userRepository.sendVerificationEmail(userInstance);
    return adminInstance;
  }
}
