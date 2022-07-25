import {CrudRepository, CrudRepositoryImpl, DefaultCrudRepository, Entity} from '@loopback/repository';
import {EdropsBackendApplication} from '../application';
import {
  Admin,
  Customer,
  CustomerAddress,
  FileInfo,
  Forum,
  FoundryWorker,
  OrderChip,
  OrderInfo,
  OrderItemBase,
  OrderProduct,
  Project,
  User,
} from '../models';
import {
  AdminRepository,
  CustomerAddressRepository,
  CustomerRepository,
  FileInfoRepository,
  ForumRepository,
  FoundryWorkerRepository,
  OrderChipRepository,
  OrderInfoRepository,
  OrderItemBaseRepository,
  OrderProductRepository,
  ProjectRepository,
  UserRepository,
} from '../repositories';
import {
  defaultAdmins,
  defaultCustomerAddresses,
  defaultCustomers,
  defaultForums,
  defaultFoundryWorkers,
  defaultProjects,
} from './data/index';

export async function clearDb(this: EdropsBackendApplication): Promise<void> {
  const forumRepo: ForumRepository = await this.getRepository(ForumRepository);
  forumRepo.deleteAll();
  forumRepo.execute('ALTER TABLE Forum AUTO_INCREMENT = ?', [1]);
  const projectRepo: ProjectRepository = await this.getRepository(
    ProjectRepository,
  );
  await projectRepo.deleteAll();
  await projectRepo.execute('ALTER TABLE Project AUTO_INCREMENT = ?', [1]);
  const adminRepo: AdminRepository = await this.getRepository(AdminRepository);
  await adminRepo.deleteAll();
  await adminRepo.execute('ALTER TABLE admin AUTO_INCREMENT = ?', [1]);
  const customerRepo: CustomerRepository = await this.getRepository(
    CustomerRepository,
  );
  await customerRepo.deleteAll();
  await customerRepo.execute('ALTER TABLE customer AUTO_INCREMENT = ?', [1]);
  const customerAddressRepo: CustomerAddressRepository =
    await this.getRepository(CustomerAddressRepository);
  await customerAddressRepo.deleteAll();
  await customerAddressRepo.execute(
    'ALTER TABLE customerAddress AUTO_INCREMENT = ?',
    [1],
  );
  const foundryWorkerRepo: FoundryWorkerRepository = await this.getRepository(
    FoundryWorkerRepository,
  );
  await foundryWorkerRepo.deleteAll();
  await foundryWorkerRepo.execute(
    'ALTER TABLE foundryWorker AUTO_INCREMENT = ?',
    [1],
  );
  const userRepo: UserRepository = await this.getRepository(UserRepository);
  await userRepo.deleteAll();
  // await userRepo.execute('ALTER TABLE User AUTO_INCREMENT = ?', [
  //   1,
  // ]);
  const orderInfoRepo: OrderInfoRepository = await this.getRepository(
    OrderInfoRepository,
  );
  await orderInfoRepo.deleteAll();
  const orderChipRepo: OrderChipRepository = await this.getRepository(
    OrderChipRepository,
  );
  await orderChipRepo.deleteAll();
  const orderItemBaseRepo: OrderItemBaseRepository = await this.getRepository(
    OrderItemBaseRepository,
  );
  await orderItemBaseRepo.deleteAll();
  const orderProductRepo: OrderProductRepository = await this.getRepository(
    OrderProductRepository,
  );
  await orderProductRepo.deleteAll();
  const fileInfoRepo: FileInfoRepository = await this.getRepository(
    FileInfoRepository,
  );
  await fileInfoRepo.deleteAll();
}

export async function seedDb(this: EdropsBackendApplication): Promise<void> {
  const forumRepo: ForumRepository = await this.getRepository(ForumRepository);
  for (const forum of defaultForums) {
    await forumRepo.create(forum);
  }
  const projectRepo: ProjectRepository = await this.getRepository(
    ProjectRepository,
  );
  for (const project of defaultProjects) {
    await projectRepo.create(project);
  }
  const adminRepo: AdminRepository = await this.getRepository(AdminRepository);
  for (const admin of defaultAdmins) {
    await adminRepo.createAdmin(admin as Admin & User);
  }
  const customerRepo: CustomerRepository = await this.getRepository(
    CustomerRepository,
  );
  let customers : Customer[] = [];
  for (const customer of defaultCustomers) {
    const tmpCustomer = await customerRepo.createCustomer(customer as Customer & User);
    customers.push(tmpCustomer);
  }
  const customerAddressRepo: CustomerAddressRepository =
    await this.getRepository(CustomerAddressRepository);
  let customerNum = 0;
  for (const customerAddress of defaultCustomerAddresses) {
    customerAddress.customerId = customers[customerNum % 2].id;
    await customerAddressRepo.create(customerAddress);
    customerNum++;
  }
  const foundryWorkerRepo: FoundryWorkerRepository = await this.getRepository(
    FoundryWorkerRepository,
  );
  for (const foundryWorker of defaultFoundryWorkers) {
    await foundryWorkerRepo.createFoundryWorker(
      foundryWorker as FoundryWorker & User,
    );
  }
  // const userRepo: CrudRepository<UserBase> = await this.getRepository(
  //   UserRepository,
  // );
  // for (const user of defaultUsers) {
  //   await userRepo.create(user);
  // }
}
