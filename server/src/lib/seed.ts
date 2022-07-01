import {
  Project,
  Forum,
  Customer,
  CustomerAddress,
  FoundryWorker,
  User,
  Admin,
} from '../models';
import {
  CustomerAddressRepository,
  CustomerRepository,
  UserRepository,
  FoundryWorkerRepository,
  ForumRepository,
  ProjectRepository,
  AdminRepository,
} from '../repositories';
import {CrudRepository, CrudRepositoryImpl} from '@loopback/repository';
import {
  defaultForums,
  defaultProjects,
  defaultCustomers,
  defaultCustomerAddresses,
  defaultFoundryWorkers,
  defaultUsers,
  defaultAdmins,
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
      const adminRepo: CrudRepositoryImpl<Customer, 1> =
        await this.getRepository(CustomerRepository);
      await adminRepo.deleteAll();
      await adminRepo.execute('ALTER TABLE admin AUTO_INCREMENT = ?', [
        1,
      ]);
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
      const userRepo: CrudRepositoryImpl<User, 1> =
        await this.getRepository(UserRepository);
      await userRepo.deleteAll();
      await userRepo.execute('ALTER TABLE User AUTO_INCREMENT = ?', [
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
      const adminRepo: AdminRepository = await this.getRepository(
        AdminRepository,
      );
      for (const admin of defaultAdmins) {
        await adminRepo.createAdmin(admin as Admin & User);
      }
      const customerRepo: CustomerRepository = await this.getRepository(
        CustomerRepository,
      );
      for (const customer of defaultCustomers) {
        await customerRepo.createCustomer(customer as Customer & User);
      }
      const customerAddressRepo: CrudRepository<CustomerAddress> =
        await this.getRepository(CustomerAddressRepository);
      for (const customerAddress of defaultCustomerAddresses) {
        await customerAddressRepo.create(customerAddress);
      }
      const foundryWorkerRepo: FoundryWorkerRepository =
        await this.getRepository(FoundryWorkerRepository);
      for (const foundryWorker of defaultFoundryWorkers) {
        await foundryWorkerRepo.createFoundryWorker(foundryWorker as FoundryWorker & User);
      }
      // const userRepo: CrudRepository<UserBase> = await this.getRepository(
      //   UserRepository,
      // );
      // for (const user of defaultUsers) {
      //   await userRepo.create(user);
      // }
      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
