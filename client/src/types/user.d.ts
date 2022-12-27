export interface Customer extends User {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  customerType: string;
}

export interface Admin extends User {
  realm: string | null;
  phoneNumber: string;
}

export interface Worker extends User {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  affiliation: string;
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