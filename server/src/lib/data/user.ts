import {User} from '../../models';

export const defaultUsers: Partial<User>[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-bbbb-aaaaaaaaaaaa',
    userType: 'customer',
    username: 'community1',
    password: 'edropTest123',
    email: 'edropswebsite@gmail.com',
    emailVerified: true,
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-cccc-aaaaaaaaaaaa',
    userType: 'customer',
    username: 'community2',
    password: 'edropTest123',
    email: 'edropswebsite+2@gmail.com',
    emailVerified: true,
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-dddd-aaaaaaaaaaaa',
    userType: 'customer',
    username: 'community3',
    password: 'edropTest123',
    email: 'edropswebsite+3@gmail.com',
    emailVerified: true,
  },
];
