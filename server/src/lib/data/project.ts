import { Project } from '../../models';

export const defaultProjects: Partial<Project>[] = [
  {
    id: 1,
    author: 'community1',
    title: 'My first functional EWOD device!',
    content:
      'I just manufactured my first functional EWOD device! I\'m so excited to share it with the community. I\'m looking forward to hearing your feedback.',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    likes: 0,
  },
  {
    id: 2,
    author: 'community2',
    title: 'OpenDrop demonstration',
    content:
      'Here is a demonstration of the OpenDrop device. It\'s pretty cool. Let me know what you think.',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 9),
    likes: 0,
  },
];
