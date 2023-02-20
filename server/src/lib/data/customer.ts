import { Customer, CustomerAddress, User } from '../../models';
import { DTO } from '../types/model';

export const defaultCustomers: DTO<Customer & User & Partial<Omit<CustomerAddress, 'id'>>>[] = [
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
    id: 'aaaaaaaa-cccc-aaaa-aaaa-aaaaaaaaaaaa',
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
