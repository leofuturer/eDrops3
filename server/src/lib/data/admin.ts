import { Admin, User } from '../../models';
import { DTO } from '../types/model';

export const defaultAdmins: DTO<Admin & User>[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    username: 'adminA',
    email: 'edropswebsite+adminA@gmail.com',
    password: 'edropTest123',
    phoneNumber: '1-310-111-2222',
    emailVerified: true,
  },
];
