import { Customer } from '../../models';

export const defaultCustomers: Partial<Customer>[] = [
  {
    id: 'aaaaaaaa-bbbb-aaaa-aaaa-aaaaaaaaaaaa',
    firstName: 'Ryan',
    lastName: 'Liu',
    phoneNumber: '3102896978',
    customerType: 'person',
    username: 'customerA',
    password: 'edropTest123',
    email: '18811370211@163.com',
    emailVerified: true,
  },
  {
    id: 'aaaaaaaa-cccc-aaaa-aaaa-aaaaaaaaaaab',
    firstName: 'John',
    lastName: 'Wang',
    phoneNumber: '3102896978',
    customerType: 'person',
    username: 'customerB',
    password: 'edropTest123',
    email: 'qiningwang_bit@163.com',
    emailVerified: true,
  },
];
