import {CrudRepository, CrudRepositoryImpl} from '@loopback/repository';
import {EdropsBackendApplication} from '../application';
import {
  Admin,
  Customer,
  CustomerAddress,
  FileInfo,
  Post,
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
  PostRepository,
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
  defaultPosts,
  defaultFoundryWorkers,
  defaultProjects,
} from './data/index';

export async function clearDb(this: EdropsBackendApplication): Promise<void> {
  const postRepo: PostRepository = await this.getRepository(PostRepository);
  postRepo.deleteAll();
  const projectRepo: ProjectRepository = await this.getRepository(
    ProjectRepository,
  );
  await projectRepo.deleteAll();
  const adminRepo: AdminRepository = await this.getRepository(AdminRepository);
  await adminRepo.deleteAll();
  const customerRepo: CustomerRepository = await this.getRepository(
    CustomerRepository,
  );
  await customerRepo.deleteAll();
  const customerAddressRepo: CustomerAddressRepository =
    await this.getRepository(CustomerAddressRepository);
  await customerAddressRepo.deleteAll();
  const foundryWorkerRepo: FoundryWorkerRepository = await this.getRepository(
    FoundryWorkerRepository,
  );
  await foundryWorkerRepo.deleteAll();
  const userRepo: UserRepository = await this.getRepository(UserRepository);
  await userRepo.deleteAll();
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
  const postRepo: PostRepository = await this.getRepository(PostRepository);
  for (const post of defaultPosts) {
    await postRepo.create(post);
  }
  const projectRepo: ProjectRepository = await this.getRepository(
    ProjectRepository,
  );
  for (const project of defaultProjects) {
    await projectRepo.create(project);
  }
  const adminRepo: AdminRepository = await this.getRepository(AdminRepository);
  for (const admin of defaultAdmins) {
    await adminRepo.createAdmin(admin);
  }
  const customerRepo: CustomerRepository = await this.getRepository(
    CustomerRepository,
  );
  for (const customer of defaultCustomers) {
    await customerRepo.createCustomer(customer);
  }
  const customerAddressRepo: CustomerAddressRepository =
    await this.getRepository(CustomerAddressRepository);
  for (const customerAddress of defaultCustomerAddresses) {
    await customerAddressRepo.create(customerAddress);
  }
  const foundryWorkerRepo: FoundryWorkerRepository = await this.getRepository(
    FoundryWorkerRepository,
  );
  for (const foundryWorker of defaultFoundryWorkers) {
    await foundryWorkerRepo.createFoundryWorker(foundryWorker);
  }
  // const userRepo: CrudRepository<UserBase> = await this.getRepository(
  //   UserRepository,
  // );
  // for (const user of defaultUsers) {
  //   await userRepo.create(user);
  // }
}
