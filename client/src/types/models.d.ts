export type * from '/@server/lib/types/index'

import type { Address, Admin, Customer, DTO, FoundryWorker, User } from '/@server/lib/types/index';

export type IncludeUser<T extends Admin | Customer | FoundryWorker> = T & {
  user: DTO<User>;
};

export type IncludeAddress<T extends Customer> = T & {
  addresses: DTO<Address>;
};