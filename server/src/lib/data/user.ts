import {User} from '../../models';
import { DTO } from '../types/model';

export const defaultUsers: DTO<User>[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-bbbb-aaaaaaaaaaaa',
    userType: 'customer',
    username: 'community1',
    password: 'edropTest123',
    email: 'edropswebsite+community1@gmail.com',
    emailVerified: true,
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-cccc-aaaaaaaaaaaa',
    userType: 'customer',
    username: 'community2',
    password: 'edropTest123',
    email: 'edropswebsite+community2@gmail.com',
    emailVerified: true,
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-dddd-aaaaaaaaaaaa',
    userType: 'customer',
    username: 'community3',
    password: 'edropTest123',
    email: 'edropswebsite+community3@gmail.com',
    emailVerified: true,
  },
];
