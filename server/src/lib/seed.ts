import {EdropsBackendApplication} from '../application';
import {
  Admin,
  Customer,
  CustomerAddress,
  Post,
  PostComment,
  User,
} from '../models';
import {
  AdminRepository,
  CustomerAddressRepository,
  CustomerRepository,
  FileInfoRepository,
  FoundryWorkerRepository,
  OrderChipRepository,
  OrderInfoRepository,
  OrderItemBaseRepository,
  OrderProductRepository,
  PostCommentLinkRepository,
  PostCommentRepository,
  PostRepository,
  ProjectCommentLinkRepository,
  ProjectCommentRepository,
  ProjectFileRepository,
  ProjectLinkRepository,
  ProjectRepository,
  UserRepository,
  OrderMessageRepository,
} from '../repositories';
import {
  defaultAdmins,
  defaultCustomerAddresses,
  defaultCustomers,
  defaultFoundryWorkers,
  defaultPostComments,
  defaultPosts,
  defaultProjects,
  defaultUsers,
} from './data/index';

export async function clearDb(this: EdropsBackendApplication): Promise<void> {
  /** Clear Admin table **/
  const adminRepo: AdminRepository = await this.getRepository(AdminRepository);
  await adminRepo.deleteAll();
  await adminRepo.execute('ALTER TABLE Admin AUTO_INCREMENT = ?', [1]); // resets auto increment

  /** Clear Customer table **/
  const customerRepo: CustomerRepository = await this.getRepository(
    CustomerRepository,
  );
  await customerRepo.deleteAll();
  await customerRepo.execute('ALTER TABLE Customer AUTO_INCREMENT = ?', [1]);

  /** Clear CustomerAddress table **/
  const customerAddressRepo: CustomerAddressRepository =
    await this.getRepository(CustomerAddressRepository);
  await customerAddressRepo.deleteAll();
  await customerAddressRepo.execute(
    'ALTER TABLE CustomerAddress AUTO_INCREMENT = ?',
    [1],
  );

  /** Clear FoundryWorker table **/
  const foundryWorkerRepo: FoundryWorkerRepository = await this.getRepository(
    FoundryWorkerRepository,
  );
  await foundryWorkerRepo.deleteAll();
  await foundryWorkerRepo.execute(
    'ALTER TABLE FoundryWorker AUTO_INCREMENT = ?',
    [1],
  );

  /** Clear User table **/
  const userRepo: UserRepository = await this.getRepository(UserRepository);
  await userRepo.deleteAll();
  await userRepo.execute('ALTER TABLE User AUTO_INCREMENT = ?', [1]);

  /** Clear OrderInfo table **/
  const orderInfoRepo: OrderInfoRepository = await this.getRepository(
    OrderInfoRepository,
  );
  await orderInfoRepo.deleteAll();
  await orderInfoRepo.execute('ALTER TABLE OrderInfo AUTO_INCREMENT = ?', [1]);

  /** Clear OrderChip table **/
  const orderChipRepo: OrderChipRepository = await this.getRepository(
    OrderChipRepository,
  );
  await orderChipRepo.deleteAll();
  await orderChipRepo.execute('ALTER TABLE OrderChip AUTO_INCREMENT = ?', [1]);

  /** Clear OrderItemBase table **/
  const orderItemBaseRepo: OrderItemBaseRepository = await this.getRepository(
    OrderItemBaseRepository,
  );
  await orderItemBaseRepo.deleteAll();
  await orderItemBaseRepo.execute(
    'ALTER TABLE OrderItemBase AUTO_INCREMENT = ?',
    [1],
  );

  const orderMessageRepo: OrderMessageRepository = await this.getRepository(
    OrderMessageRepository,
  );
  await orderMessageRepo.deleteAll();
  
  const orderProductRepo: OrderProductRepository = await this.getRepository(
    OrderProductRepository,
  );
  await orderProductRepo.deleteAll();
  await orderProductRepo.execute(
    'ALTER TABLE OrderProduct AUTO_INCREMENT = ?',
    [1],
  );

  /** Clear FileInfo table **/
  const fileInfoRepo: FileInfoRepository = await this.getRepository(
    FileInfoRepository,
  );
  await fileInfoRepo.deleteAll();
  await fileInfoRepo.execute('ALTER TABLE FileInfo AUTO_INCREMENT = ?', [1]);

  /** Clear Post table **/
  const postRepo: PostRepository = await this.getRepository(PostRepository);
  await postRepo.deleteAll();
  await postRepo.execute('ALTER TABLE Post AUTO_INCREMENT = ?', [1]);

  /** Clear PostComment table **/
  const postCommentRepo: PostCommentRepository = await this.getRepository(
    PostCommentRepository,
  );
  await postCommentRepo.deleteAll();
  await postCommentRepo.execute('ALTER TABLE PostComment AUTO_INCREMENT = ?', [
    1,
  ]);

  /** Clear PostCommentLink table */
  const postCommentLinkRepo: PostCommentLinkRepository =
    await this.getRepository(PostCommentLinkRepository);
  await postCommentLinkRepo.deleteAll();
  await postCommentLinkRepo.execute(
    'ALTER TABLE PostCommentLink AUTO_INCREMENT = ?',
    [1],
  );

  /** Clear Project table **/
  const projectRepo: ProjectRepository = await this.getRepository(
    ProjectRepository,
  );
  await projectRepo.deleteAll();
  await projectRepo.execute('ALTER TABLE Project AUTO_INCREMENT = ?', [1]);

  /** Clear ProjectComment table **/
  const projectCommentRepo: ProjectCommentRepository = await this.getRepository(
    ProjectCommentRepository,
  );
  await projectCommentRepo.deleteAll();
  await projectCommentRepo.execute(
    'ALTER TABLE ProjectComment AUTO_INCREMENT = ?',
    [1],
  );

  /** Clear ProjectCommentLink table */
  const projectCommentLinkRepo: ProjectCommentLinkRepository =
    await this.getRepository(ProjectCommentLinkRepository);
  await projectCommentLinkRepo.deleteAll();
  await projectCommentLinkRepo.execute(
    'ALTER TABLE ProjectCommentLink AUTO_INCREMENT = ?',
    [1],
  );

  /** Clear ProjectFile table */
  const projectFileRepo: ProjectFileRepository = await this.getRepository(
    ProjectFileRepository,
  );
  await projectFileRepo.deleteAll();
  await projectFileRepo.execute('ALTER TABLE ProjectFile AUTO_INCREMENT = ?', [
    1,
  ]);

  /** Clear ProjectLink table */
  const projectLinkRepo: ProjectLinkRepository = await this.getRepository(
    ProjectLinkRepository,
  );
  await projectLinkRepo.deleteAll();
  await projectLinkRepo.execute('ALTER TABLE ProjectLink AUTO_INCREMENT = ?', [
    1,
  ]);
}

export async function seedDb(this: EdropsBackendApplication): Promise<void> {
  /** Seed Admin table **/
  const adminRepo: AdminRepository = await this.getRepository(AdminRepository);
  const admins: Admin[] = await Promise.all(
    defaultAdmins.map(admin => adminRepo.createAdmin(admin)),
  );

  /** Seed Customer table **/
  const customerRepo: CustomerRepository = await this.getRepository(
    CustomerRepository,
  );
  const customers: Customer[] = await Promise.all(
    defaultCustomers.map(customer =>
      customerRepo.createCustomer(customer, false),
    ),
  );

  /** Seed CustomerAddress table **/
  const customerAddressRepo: CustomerAddressRepository =
    await this.getRepository(CustomerAddressRepository);
  const customerAddresses: CustomerAddress[] = await Promise.all(
    defaultCustomerAddresses.map(customerAddress =>
      customerRepo
        .customerAddresses(customerAddress.customerId)
        .create(customerAddress),
    ),
  );

  /** Seed FoundryWorker table **/
  const foundryWorkerRepo: FoundryWorkerRepository = await this.getRepository(
    FoundryWorkerRepository,
  );
  const foundryWorkers = await Promise.all(
    defaultFoundryWorkers.map(foundryWorker =>
      foundryWorkerRepo.createFoundryWorker(foundryWorker),
    ),
  );

  /** Seed User table **/
  const userRepo: UserRepository = await this.getRepository(UserRepository);
  const users: User[] = await Promise.all(
    defaultUsers.map(user => userRepo.create(user)),
  );

  /** Seed Post table **/
  const postRepo: PostRepository = await this.getRepository(PostRepository);
  const posts: Post[] = await Promise.all(
    defaultPosts.map(post => postRepo.create(post)),
  );

  /** Seed PostComment table **/
  const postCommentRepo: PostCommentRepository = await this.getRepository(
    PostCommentRepository,
  );
  const postComments: PostComment[] = await Promise.all(
    defaultPostComments.map(postComment =>
      postRepo.postComments(postComment.postId).create(postComment),
    ),
  );

  /** Seed Project table **/
  const projectRepo: ProjectRepository = await this.getRepository(
    ProjectRepository,
  );
  const projects = await Promise.all(
    defaultProjects.map(project => projectRepo.create(project)),
  );

  /** Seed ProjectComment table **/
  // const projectCommentRepo: ProjectCommentRepository = await this.getRepository(
  //   ProjectCommentRepository,
  // );
  // const projectComments = await Promise.all(
  //   defaultProjectComments.map(projectComment => projectCommentRepo.create(projectComment)),
  // );
}
