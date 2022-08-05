import { EdropsBackendApplication } from '../application';
import {
  Customer, User
} from '../models';
import {
  AdminRepository,
  CustomerAddressRepository,
  CustomerRepository,
  FileInfoRepository, FoundryWorkerRepository,
  OrderChipRepository,
  OrderInfoRepository,
  OrderItemBaseRepository,
  OrderMessageRepository,
  OrderProductRepository, PostCommentRepository, PostRepository, ProjectRepository,
  UserRepository
} from '../repositories';
import {
  createPostComment, defaultAdmins,
  defaultCustomerAddresses,
  defaultCustomers, defaultFoundryWorkers, defaultPosts, defaultProjects
} from './data/index';

export async function clearDb(this: EdropsBackendApplication): Promise<void> {
  const adminRepo: AdminRepository = await this.getRepository(AdminRepository);
  await adminRepo.deleteAll();
  await adminRepo.execute('ALTER TABLE Admin AUTO_INCREMENT = ?', [1]); // resets auto increment
  
  const customerRepo: CustomerRepository = await this.getRepository(
    CustomerRepository,
  );
  await customerRepo.deleteAll();
  await customerRepo.execute('ALTER TABLE Customer AUTO_INCREMENT = ?', [1]);

  const customerAddressRepo: CustomerAddressRepository =
    await this.getRepository(CustomerAddressRepository);
  await customerAddressRepo.deleteAll();
  await customerAddressRepo.execute('ALTER TABLE CustomerAddress AUTO_INCREMENT = ?', [1]);

  const foundryWorkerRepo: FoundryWorkerRepository = await this.getRepository(
    FoundryWorkerRepository,
  );
  await foundryWorkerRepo.deleteAll();
  await foundryWorkerRepo.execute('ALTER TABLE FoundryWorker AUTO_INCREMENT = ?', [1]);

  const userRepo: UserRepository = await this.getRepository(UserRepository);
  await userRepo.deleteAll();
  await userRepo.execute('ALTER TABLE User AUTO_INCREMENT = ?', [1]);

  const orderInfoRepo: OrderInfoRepository = await this.getRepository(
    OrderInfoRepository,
  );
  await orderInfoRepo.deleteAll();
  await orderInfoRepo.execute('ALTER TABLE OrderInfo AUTO_INCREMENT = ?', [1]);

  const orderChipRepo: OrderChipRepository = await this.getRepository(
    OrderChipRepository,
  );
  await orderChipRepo.deleteAll();
  await orderChipRepo.execute('ALTER TABLE OrderChip AUTO_INCREMENT = ?', [1]);

  const orderItemBaseRepo: OrderItemBaseRepository = await this.getRepository(
    OrderItemBaseRepository,
  );
  await orderItemBaseRepo.deleteAll();
  await orderItemBaseRepo.execute('ALTER TABLE OrderItemBase AUTO_INCREMENT = ?', [1]);

  const orderMessageRepo: OrderMessageRepository = await this.getRepository(
    OrderMessageRepository,
  );
  await orderMessageRepo.deleteAll();
  const orderProductRepo: OrderProductRepository = await this.getRepository(
    OrderProductRepository,
  );
  await orderProductRepo.deleteAll();
  await orderProductRepo.execute('ALTER TABLE OrderProduct AUTO_INCREMENT = ?', [1]);

  const fileInfoRepo: FileInfoRepository = await this.getRepository(
    FileInfoRepository,
  );
  await fileInfoRepo.deleteAll();
  await fileInfoRepo.execute('ALTER TABLE FileInfo AUTO_INCREMENT = ?', [1]);

  const postRepo: PostRepository = await this.getRepository(PostRepository);
  await postRepo.deleteAll();
  await postRepo.execute('ALTER TABLE Post AUTO_INCREMENT = ?', [1]);

  const projectRepo: ProjectRepository = await this.getRepository(
    ProjectRepository,
  );
  await projectRepo.deleteAll();
  await projectRepo.execute('ALTER TABLE Project AUTO_INCREMENT = ?', [1]);
}

export async function seedDb(this: EdropsBackendApplication): Promise<void> {
  const userIds: typeof User.prototype.id[] = [];
  const customers: Customer[] = [];

  const adminRepo: AdminRepository = await this.getRepository(AdminRepository);
  for (const admin of defaultAdmins) {
    const adminInstance = await adminRepo.createAdmin(admin);
    userIds.push(adminInstance.id);
  }

  const customerRepo: CustomerRepository = await this.getRepository(
    CustomerRepository,
  );
  for (const customer of defaultCustomers) {
    const customerInstance = await customerRepo.createCustomer(customer);
    customers.push(customerInstance);
    userIds.push(customerInstance.id)
  }

  const customerAddressRepo: CustomerAddressRepository = await this.getRepository(CustomerAddressRepository);
  for (const [index, customerAddress] of defaultCustomerAddresses.entries()) {
    customerAddress.customerId = customers[index % 2].id;
    await customerAddressRepo.create(customerAddress);
  }

  const foundryWorkerRepo: FoundryWorkerRepository = await this.getRepository(FoundryWorkerRepository);
  for (const foundryWorker of defaultFoundryWorkers) {
    const foundryWorkerInstance = await foundryWorkerRepo.createFoundryWorker(foundryWorker);
    userIds.push(foundryWorkerInstance.id)
  }

  const postRepo: PostRepository = await this.getRepository(PostRepository);
  const postCommentRepo: PostCommentRepository = await this.getRepository(
    PostCommentRepository,
  );
  for (const post of defaultPosts) {
    const postInstance = await postRepo.create(post);
    for (let i = 0; i < 1 + Math.random() * 5; i+=1) {
      const postComment = await postRepo
        .postComments(postInstance.id)
        .create(createPostComment(userIds[Math.floor(Math.random() * userIds.length)]));
      for (let i = 0; i < 1 + Math.random() * 5; i+=1) {
        const postCommentComment = await postCommentRepo
          .postComments(postComment.id)
          .create(createPostComment(userIds[Math.floor(Math.random() * userIds.length)]));
      }
    }
  }

  const projectRepo: ProjectRepository = await this.getRepository(
    ProjectRepository,
  );
  for (const project of defaultProjects) {
    await projectRepo.create(project);
  }
}
