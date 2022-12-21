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

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}