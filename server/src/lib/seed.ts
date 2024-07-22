import { EdropsBackendApplication } from '../application';
import {
  Admin,
  Customer,
  Address,
  Post,
  Comment, User
} from '../models';
import {
  AdminRepository,
  AddressRepository,
  CustomerRepository,
  FileInfoRepository,
  FoundryWorkerRepository,
  OrderChipRepository,
  OrderInfoRepository,
  OrderItemRepository,
  OrderMessageRepository,
  OrderProductRepository,
  CommentLinkRepository,
  CommentRepository,
  PostRepository,
  ProjectFileRepository,
  ProjectLinkRepository,
  ProjectRepository,
  UserRepository
} from '../repositories';
import {
  defaultAdmins,
  defaultAddresses,
  defaultCustomers,
  defaultFoundryWorkers,
  defaultComments,
  defaultPosts,
  defaultProjects,
  defaultUsers
} from './data/index';
import { defaultProjectFiles } from './data/projectFile';
import { defaultProjectLinks } from './data/projectLink';
import fs from 'fs';
import path from 'path';

export async function clearDb(this: EdropsBackendApplication): Promise<void> {
  /* Clear Admin table */
  const adminRepo: AdminRepository = await this.getRepository(AdminRepository);
  await adminRepo.deleteAll();
  await adminRepo.execute('ALTER TABLE Admin AUTO_INCREMENT = ?', [1]); // resets auto increment

  /* Clear Customer table */
  const customerRepo: CustomerRepository = await this.getRepository(
    CustomerRepository,
  );
  await customerRepo.deleteAll();
  await customerRepo.execute('ALTER TABLE Customer AUTO_INCREMENT = ?', [1]);

  /* Clear Address table */
  const AddressRepo: AddressRepository =
    await this.getRepository(AddressRepository);
  await AddressRepo.deleteAll();
  await AddressRepo.execute(
    'ALTER TABLE Address AUTO_INCREMENT = ?',
    [1],
  );

  /* Clear FoundryWorker table */
  const foundryWorkerRepo: FoundryWorkerRepository = await this.getRepository(
    FoundryWorkerRepository,
  );
  await foundryWorkerRepo.deleteAll();
  await foundryWorkerRepo.execute(
    'ALTER TABLE FoundryWorker AUTO_INCREMENT = ?',
    [1],
  );

  /* Clear User table */
  const userRepo: UserRepository = await this.getRepository(UserRepository);
  await userRepo.deleteAll();
  await userRepo.execute('ALTER TABLE User AUTO_INCREMENT = ?', [1]);

  /* Clear OrderInfo table */
  const orderInfoRepo: OrderInfoRepository = await this.getRepository(
    OrderInfoRepository,
  );
  await orderInfoRepo.deleteAll();
  await orderInfoRepo.execute('ALTER TABLE OrderInfo AUTO_INCREMENT = ?', [1]);

  /* Clear OrderChip table */
  const orderChipRepo: OrderChipRepository = await this.getRepository(
    OrderChipRepository,
  );
  await orderChipRepo.deleteAll();
  await orderChipRepo.execute('ALTER TABLE OrderChip AUTO_INCREMENT = ?', [1]);

  /* Clear OrderItem table */
  const orderItemRepo: OrderItemRepository = await this.getRepository(
    OrderItemRepository,
  );
  await orderItemRepo.deleteAll();
  await orderItemRepo.execute(
    'ALTER TABLE OrderItem AUTO_INCREMENT = ?',
    [1],
  );

  const orderMessageRepo: OrderMessageRepository = await this.getRepository(
    OrderMessageRepository,
  );
  await orderMessageRepo.deleteAll();
  await orderMessageRepo.execute('ALTER TABLE OrderMessage AUTO_INCREMENT = ?', [1]);

  const orderProductRepo: OrderProductRepository = await this.getRepository(
    OrderProductRepository,
  );
  await orderProductRepo.deleteAll();
  await orderProductRepo.execute(
    'ALTER TABLE OrderProduct AUTO_INCREMENT = ?',
    [1],
  );

  /* Clear FileInfo table */
  const fileInfoRepo: FileInfoRepository = await this.getRepository(
    FileInfoRepository,
  );
  await fileInfoRepo.deleteAll();
  await fileInfoRepo.execute('ALTER TABLE FileInfo AUTO_INCREMENT = ?', [1]);

  /* Clear Post table */
  const postRepo: PostRepository = await this.getRepository(PostRepository);
  await postRepo.deleteAll();
  await postRepo.execute('ALTER TABLE Post AUTO_INCREMENT = ?', [1]);

  /* Clear Comment table */
  // const commentRepo: CommentRepository = await this.getRepository(
  //   CommentRepository,
  // );
  // await commentRepo.deleteAll();
  // await commentRepo.execute('ALTER TABLE comment AUTO_INCREMENT = ?', [
  //   1,
  // ]);

  /* Clear commentLink table */
  // const commentLinkRepo: CommentLinkRepository =
  //   await this.getRepository(CommentLinkRepository);
  // await commentLinkRepo.deleteAll();
  // await commentLinkRepo.execute(
  //   'ALTER TABLE commentLink AUTO_INCREMENT = ?',
  //   [1],
  // );

  /* Clear Project table */
  const projectRepo: ProjectRepository = await this.getRepository(
    ProjectRepository,
  );
  await projectRepo.deleteAll();
  await projectRepo.execute('ALTER TABLE Project AUTO_INCREMENT = ?', [1]);


  /* Clear ProjectFile table */
  const projectFileRepo: ProjectFileRepository = await this.getRepository(
    ProjectFileRepository,
  );
  await projectFileRepo.deleteAll();
  await projectFileRepo.execute('ALTER TABLE ProjectFile AUTO_INCREMENT = ?', [
    1,
  ]);

  /* Clear ProjectLink table */
  const projectLinkRepo: ProjectLinkRepository = await this.getRepository(
    ProjectLinkRepository,
  );
  await projectLinkRepo.deleteAll();
  await projectLinkRepo.execute('ALTER TABLE ProjectLink AUTO_INCREMENT = ?', [
    1,
  ]);
}

export async function seedDb(this: EdropsBackendApplication): Promise<void> {
  /* Seed Admin table */
  const adminRepo: AdminRepository = await this.getRepository(AdminRepository);
  const admins: Admin[] = await Promise.all(
    defaultAdmins.map(admin => adminRepo.createAdmin(admin)),
  );

  /* Seed Customer table */
  const customerRepo: CustomerRepository = await this.getRepository(
    CustomerRepository,
  );
  const customers: Customer[] = await Promise.all(
    defaultCustomers.map(customer =>
      customerRepo.createCustomer(customer),
    ),
  );

  /* Seed Address table */
  const addressRepo: AddressRepository =
    await this.getRepository(AddressRepository);
  const addresses: Address[] = await Promise.all(
    defaultAddresses.map(address =>
      customerRepo
        .addresses(address.userId)
        .create(address),
    ),
  );

  /* Seed FoundryWorker table */
  const foundryWorkerRepo: FoundryWorkerRepository = await this.getRepository(
    FoundryWorkerRepository,
  );
  const foundryWorkers = await Promise.all(
    defaultFoundryWorkers.map(foundryWorker =>
      foundryWorkerRepo.createFoundryWorker(foundryWorker),
    ),
  );

  /* Seed User table */
  const userRepo: UserRepository = await this.getRepository(UserRepository);
  const users: User[] = await Promise.all(
    defaultUsers.map(user => userRepo.createUser(user)),
  );

  /* Seed Post table */
  const postRepo: PostRepository = await this.getRepository(PostRepository);
  const posts: Post[] = await Promise.all(
    defaultPosts.map(post => postRepo.create(post)),
  );

  /* Seed comment table */
  const commentRepo: CommentRepository = await this.getRepository(
    CommentRepository,
  );
  const comments: Comment[] = await Promise.all(
    defaultComments.map(comment =>
      postRepo.postComments(comment.parentId).create(comment),
    ),
  );

  /* Seed Project table */
  const projectRepo: ProjectRepository = await this.getRepository(
    ProjectRepository,
  );
  const projects = await Promise.all(
    defaultProjects.map(project => projectRepo.create(project)),
  );

  /* Seed ProjectComment table */
  // const projectCommentRepo: ProjectCommentRepository = await this.getRepository(
  //   ProjectCommentRepository,
  // );
  // const projectComments = await Promise.all(
  //   defaultProjectComments.map(projectComment => projectCommentRepo.create(projectComment)),
  // );

  /* Seed ProjectLink table */
  const projectLinkRepo: ProjectLinkRepository = await this.getRepository(
    ProjectLinkRepository,
  );
  const projectLinks = await Promise.all(
    defaultProjectLinks.map(projectLink =>
      projectLinkRepo.create(projectLink),
    ),
  );

  /* Seed ProjectFile table */
  const projectFileRepo: ProjectFileRepository = await this.getRepository(
    ProjectFileRepository,
  );
  const projectFiles = await Promise.all(
    defaultProjectFiles.map(projectFile =>
      projectFileRepo.create(projectFile),
    ),
  );

  // Copy project files to local storage
  // const seedFilesDir = path.join(__dirname, 'data', 'files');
  // const storageDir = path.join(__dirname, '..', '..', 'storage', 'community');
  // if (!fs.existsSync(storageDir)) {
  //   fs.mkdirSync(storageDir);
  // }

  // for (const projectFile of projectFiles) {
  //   const seedFilePath = path.join(seedFilesDir, projectFile.containerFileName);
  //   const storageFilePath = path.join(storageDir, projectFile.containerFileName);
  //   fs.copyFileSync(seedFilePath, storageFilePath);
  // }
}
