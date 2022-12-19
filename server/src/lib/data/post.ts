import { Post } from '../../models';

export const defaultPosts: Partial<Post>[] = [
  {
    id: 1,
    userId: 'aaaaaaaa-aaaa-aaaa-bbbb-aaaaaaaaaaaa',
    author: 'community1',
    title: 'Electrodes on EWOD device not actuating',
    content:
      'The electrodes on my EWOD device aren\'t activating. It\'s not related to the power source as I\'ve tried multiple power sources. I\'ve also tried different electrodes. I\'ve tried to contact the manufacturer but they haven\'t responded. Does anyone know what the problem could be?',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    comments: 1,
    likes: 0,
  },
  {
    id: 2,
    userId: 'aaaaaaaa-aaaa-aaaa-cccc-aaaaaaaaaaaa',
    author: 'community2',
    title: 'Dispensing not working on EWOD device',
    content:
      'For some reason the dispensing is not working on my EWOD device. I have tried everything I can think of. Any suggestions?',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    comments: 1,
    likes: 0,
  },
  {
    id: 3,
    userId: 'aaaaaaaa-aaaa-aaaa-dddd-aaaaaaaaaaaa',
    author: 'community3',
    title: 'What are EWOD devices used for?',
    content:
      'I\'m new to the community and would like to learn more about the different use cases for EWOD devices. I\'m interested in hearing from everyone about their experiences with EWOD devices. Thanks!',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 8),
    comments: 1,
    likes: 0,
  },
];
