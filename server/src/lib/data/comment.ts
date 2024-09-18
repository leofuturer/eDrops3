import { Comment } from '../../models';

export const defaultComments: Partial<Comment>[] = [
  /* Should be assigned to post #1 "Electrodes on EWOD device not actuating" */
  {
    content:
      'I have a lot of experience with EWOD devices. I can help you out! Send me a private message.',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    likes: 0,
    parentId: 1,
    author: 'community2',
    userId: 'aaaaaaaa-aaaa-aaaa-cccc-aaaaaaaaaaaa',
    parentType: 'post',
    top: true,
  },
  /* Should be assigned to post #2 "Dispensing not working on EWOD device" */
  {
    content: 'I am also encountering this issue. I\'m not sure what to do.',
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 0,
    parentId: 2,
    author: 'community3',
    userId: 'aaaaaaaa-aaaa-aaaa-dddd-aaaaaaaaaaaa',
    parentType: 'post',
    top: true,
  },
  /* Should be assigned to post #3 "What are EWOD devices used for?" */
  {
    content: 'I`m also interested in learning more!',
    datetime: new Date(Date.now() - 1000 * 60 * 37),
    likes: 0,
    parentId: 3,
    author: 'community1',
    userId: 'aaaaaaaa-aaaa-aaaa-bbbb-aaaaaaaaaaaa',
    parentType: 'post',
    top: true,
  },
  {
    content: 'You may want to try surfactants mentioned in this paper, which seem to be quite promising: https://pubs.acs.org/doi/10.1021/acsami.2c17317',
    datetime: new Date(Date.now() - 1000 * 60 * 37),
    likes: 0,
    parentId: 5,
    author: 'LeoDMF',
    userId: 'aaaaaaaa-aaaa-aaaa-gggg-aaaaaaaaaaaa',
    parentType: 'post',
    top: true,
  },
  {
    content: 'These two were pretty helpful to me:\nhttps://iopscience.iop.org/\narticle/10.1088/0953-8984/17/28/R01\nhttps://www.tandfonline.com/doi/full/10.1163/156856111X599562',
    datetime: new Date(Date.now() - 1000 * 60 * 37),
    likes: 0,
    parentId: 8,
    author: 'LeoDMF',
    userId: 'aaaaaaaa-aaaa-aaaa-gggg-aaaaaaaaaaaa',
    parentType: 'post',
    top: true,
  },
];
