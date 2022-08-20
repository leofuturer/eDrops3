import {faker} from '@faker-js/faker';
import {Post} from '../../models';

export const defaultPosts: Partial<Post>[] = [
  {
    author: 'community1',
    title: 'Electrodes on EWOD device not actuating',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Auctor elit sed vulputate mi sit amet. Nam libero justo laoreet sit amet cursus sit amet. Vulputate mi sit amet mauris commodo quis.',
    datetime: faker.date.recent(10),
    likes: 0,
  },
  {
    author: 'community3',
    title: 'Dispensing not working on EWOD device',
    content:
      'Fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis. Placerat in egestas erat imperdiet sed euismod nisi porta. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at. Mauris pharetra et ultrices neque ornare aenean euismod elementum nisi. Nibh tellus molestie nunc non blandit massa enim nec dui.',
    datetime: faker.date.recent(10),
    likes: 0,
  },
  {
    author: 'community2',
    title: 'What are EWOD devices used for?',
    content:
      'Fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis. Placerat in egestas erat imperdiet sed euismod nisi porta. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at. Mauris pharetra et ultrices neque ornare aenean euismod elementum nisi. Nibh tellus molestie nunc non blandit massa enim nec dui.',
    datetime: faker.date.recent(10),
    likes: 0,
  },
];

// export const defaultPosts: Partial<Post>[] = new Array(10)
//   .fill(0)
//   .map(() => createPost());

// function createPost(): Partial<Post> {
//   return {
//     author: faker.name.findName(),
//     title: faker.lorem.sentence(),
//     content: faker.lorem.paragraphs(),
//     datetime: faker.date.recent(10),
//     likes: 0,
//   };
// }
