import {Customer} from '../../models';

export const defaultCustomers: Partial<Customer>[] = [
  {
    id: 'aaaa-bbbb-cccc-dddd',
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
    id: 'aaaa-bbbb-cccc-eeee',
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
