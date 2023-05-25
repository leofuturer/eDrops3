export * from '../../../server/src/lib/types/model';

import { Admin, Customer, FoundryWorker, User } from '../../../server/src/lib/types/model';

export type IncludeUser<T extends Admin | Customer | FoundryWorker> = T & {
  user: DTO<User>;
};

export type IncludeAddress<T extends Customer> = T & {
  addresses: DTO<Address>;
};