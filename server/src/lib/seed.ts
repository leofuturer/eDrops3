import {
  Project,
  Forum,
  Customer,
  CustomerAddress,
  FoundryWorker,
  UserBase,
} from '../models';
import {
  CustomerAddressRepository,
  CustomerRepository,
  UserBaseRepository,
  FoundryWorkerRepository,
  ForumRepository,
  ProjectRepository,
} from '../repositories';
import {CrudRepository, CrudRepositoryImpl} from '@loopback/repository';
import {
  defaultForums,
  defaultProjects,
  defaultCustomers,
  defaultCustomerAddresses,
  defaultFoundryWorkers,
  defaultUserBases,
} from './data/index';

export async function clearDb(this: any): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const forumRepo: CrudRepositoryImpl<Forum, 1> = await this.getRepository(
        ForumRepository,
      );
      await forumRepo.deleteAll();
      await forumRepo.execute('ALTER TABLE Forum AUTO_INCREMENT = ?', [1]);
      const projectRepo: CrudRepositoryImpl<Project, 1> =
        await this.getRepository(ProjectRepository);
      await projectRepo.deleteAll();
      await projectRepo.execute('ALTER TABLE Project AUTO_INCREMENT = ?', [1]);
      const customerRepo: CrudRepositoryImpl<Customer, 1> =
        await this.getRepository(CustomerRepository);
      await customerRepo.deleteAll();
      await customerRepo.execute('ALTER TABLE customer AUTO_INCREMENT = ?', [
        1,
      ]);
      const customerAddressRepo: CrudRepositoryImpl<CustomerAddress, 1> =
        await this.getRepository(CustomerAddressRepository);
      await customerAddressRepo.deleteAll();
      await customerAddressRepo.execute(
        'ALTER TABLE customerAddress AUTO_INCREMENT = ?',
        [1],
      );
      const foundryWorkerRepo: CrudRepositoryImpl<FoundryWorker, 1> =
        await this.getRepository(FoundryWorkerRepository);
      await foundryWorkerRepo.deleteAll();
      await foundryWorkerRepo.execute(
        'ALTER TABLE foundryWorker AUTO_INCREMENT = ?',
        [1],
      );
      const userBaseRepo: CrudRepositoryImpl<UserBase, 1> =
        await this.getRepository(UserBaseRepository);
      await userBaseRepo.deleteAll();
      await userBaseRepo.execute('ALTER TABLE userBase AUTO_INCREMENT = ?', [
        1,
      ]);

      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

export async function seedDb(this: any): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const forumRepo: CrudRepository<Forum> = await this.getRepository(
        ForumRepository,
      );
      for (const forum of defaultForums) {
        await forumRepo.create(forum);
      }
      const projectRepo: CrudRepository<Project> = await this.getRepository(
        ProjectRepository,
      );
      for (const project of defaultProjects) {
        await projectRepo.create(project);
      }
      const customerRepo: CrudRepository<Customer> = await this.getRepository(
        CustomerRepository,
      );
      for (const customer of defaultCustomers) {
        await customerRepo.create(customer);
      }
      const customerAddressRepo: CrudRepository<CustomerAddress> =
        await this.getRepository(CustomerAddressRepository);
      for (const customerAddress of defaultCustomerAddresses) {
        await customerAddressRepo.create(customerAddress);
      }
      const foundryWorkerRepo: CrudRepository<FoundryWorker> =
        await this.getRepository(FoundryWorkerRepository);
      for (const foundryWorker of defaultFoundryWorkers) {
        await foundryWorkerRepo.create(foundryWorker);
      }
      const userBaseRepo: CrudRepository<UserBase> = await this.getRepository(
        UserBaseRepository,
      );
      for (const userBase of defaultUserBases) {
        await userBaseRepo.create(userBase);
      }
      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
