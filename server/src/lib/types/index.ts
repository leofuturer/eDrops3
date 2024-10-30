export * from '../../models';
import type { Address, Admin, Customer, FoundryWorker, User } from '../../models';

export type DTO<T> = T;

export type IncludeUser<T extends Admin | Customer | FoundryWorker> = T & {
  user: DTO<User>;
};

export type IncludeAddress<T extends Customer> = T & {
  addresses: DTO<Address>;
};

export type Count = {
  count: number;
}