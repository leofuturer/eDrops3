import { Address, Customer, User } from '../../models';
import { DTO } from '../types/model';

export const defaultCustomers: DTO<Customer & User & Partial<Omit<Address, 'id'>>>[] = [
  {
    id: 'aaaaaaaa-bbbb-aaaa-aaaa-aaaaaaaaaaaa',
    firstName: 'Ryan',
    lastName: 'Liu',
    phoneNumber: '3102896978',
    customerType: 'person',
    username: 'customerA',
    password: 'edropTest123',
    email: 'edropswebsite+customerA@gmail.com',
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
    email: 'edropswebsite+customerB@gmail.com',
    emailVerified: true,
  },
];
