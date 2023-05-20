import { Address } from "./address";

export interface Customer {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  customerType: string;
  customerAddresses: Address[];
  user: User;
}

export interface Admin {
  phoneNumber: string;
  user: User;
}

export interface Worker {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  affiliation: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  userType?: string;
}

export type Signup<T extends User> = T & { confirmPassword: string };

export type Obscure<T extends User> = Omit<T, 'id' | 'password'>;