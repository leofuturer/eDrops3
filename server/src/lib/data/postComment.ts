import { PostComment } from '../../models';

export const defaultPostComments: Partial<PostComment>[] = [
  /* Should be assigned to post #1 "Electrodes on EWOD device not actuating" */
  {
    content:
      'I have a lot of experience with EWOD devices. I can help you out! Send me a private message.',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    likes: 0,
    postId: 1,
    author: 'community2',
    userId: 'aaaaaaaa-aaaa-aaaa-cccc-aaaaaaaaaaaa',
    top: true,
  },
  /* Should be assigned to post #2 "Dispensing not working on EWOD device" */
  {
    content: 'I am also encountering this issue. I\'m not sure what to do.',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 0,
    postId: 2,
    author: 'community3',
    userId: 'aaaaaaaa-aaaa-aaaa-dddd-aaaaaaaaaaaa',
    top: true,
  },
  /* Should be assigned to post #3 "What are EWOD devices used for?" */
  {
    content: 'I`m also interested in learning more!',
    datetime: new Date(Date.now() - 1000 * 60 * 37),
    likes: 0,
    postId: 3,
    author: 'community1',
    userId: 'aaaaaaaa-aaaa-aaaa-bbbb-aaaaaaaaaaaa',
    top: true,
  },
];
