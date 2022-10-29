import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { genSalt, hash } from 'bcryptjs';
import { MysqlDsDataSource } from '../datasources';
import { FoundryWorker, FoundryWorkerRelations, OrderChip, User } from '../models';
import { OrderChipRepository } from './order-chip.repository';
import { UserRepository } from './user.repository';

export class FoundryWorkerRepository extends DefaultCrudRepository<
  FoundryWorker,
  typeof FoundryWorker.prototype.id,
  FoundryWorkerRelations
> {

  public readonly orderChips: HasManyRepositoryFactory<OrderChip, typeof FoundryWorker.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof FoundryWorker.prototype.id>;

  constructor(
    @inject('datasources.mysqlDS') dataSource: MysqlDsDataSource,
    @repository.getter('OrderChipRepository') protected orderChipRepositoryGetter: Getter<OrderChipRepository>,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(FoundryWorker, dataSource);
    // this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    // this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.orderChips = this.createHasManyRepositoryFactoryFor('orderChips', orderChipRepositoryGetter,);
    this.registerInclusionResolver('orderChips', this.orderChips.inclusionResolver);
  }

  async createFoundryWorker(
    foundryWorker: Omit<FoundryWorker & User, 'id'>
  ) : Promise<FoundryWorker> {
    const hashedPassword = await hash(foundryWorker.password, await genSalt())
    const userData: Partial<User> = {
      id: foundryWorker.id,
      realm: foundryWorker.realm,
      username: foundryWorker.username,
      password: hashedPassword,
      userType: 'worker',
      email: foundryWorker.email,
      emailVerified: foundryWorker.emailVerified,
      verificationToken: foundryWorker.verificationToken,
    }
    const userRepository = await this.userRepositoryGetter();
    const userInstance = await userRepository.create(userData);
    const foundryWorkerData = {
      ...userInstance,
      street: foundryWorker.street,
      streetLine2: foundryWorker.streetLine2,
      firstName: foundryWorker.firstName,
      lastName: foundryWorker.lastName,
      phoneNumber: foundryWorker.phoneNumber,
      country: foundryWorker.country,
      state: foundryWorker.state,
      city: foundryWorker.city,
      zipCode: foundryWorker.zipCode,
      affiliation: foundryWorker.affiliation,
      // userId: userInstance.id,
    }
    const foundryWorkerInstance = await this.create(foundryWorkerData);
    return foundryWorkerInstance;
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await hash(newPassword, await genSalt());
    await this.updateById(userId, {password: hashedPassword});

    const userRepository = await this.userRepositoryGetter();
    await userRepository.updateById(userId, {password: hashedPassword});
  }
}
