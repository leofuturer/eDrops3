import {faker} from '@faker-js/faker';
import {Project} from '../../models';

export const defaultProjects: Partial<Project>[] = [
  {
    author: 'community1',
    title: 'My first functional EWOD device!',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Auctor elit sed vulputate mi sit amet. Nam libero justo laoreet sit amet cursus sit amet. Enim ut tellus elementum sagittis vitae. Lacus sed viverra tellus in hac habitasse platea. Lectus urna duis convallis convallis. In iaculis nunc sed augue lacus viverra vitae congue. Commodo sed egestas egestas fringilla phasellus. Donec adipiscing tristique risus nec. Semper quis lectus nulla at volutpat diam. Eu scelerisque felis imperdiet proin fermentum leo. Fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis.',
    datetime: faker.date.recent(10),
    likes: 0,
  },
  {
    author: 'community1',
    title: 'OpenDrop demonstration',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Auctor elit sed vulputate mi sit amet. Nam libero justo laoreet sit amet cursus sit amet. Vulputate mi sit amet mauris commodo quis. Vitae tortor condimentum lacinia quis vel eros donec ac. Enim ut tellus elementum sagittis vitae. Lacus sed viverra tellus in hac habitasse platea. Lectus urna duis convallis convallis.',
    datetime: faker.date.recent(10),
    likes: 0,
  },
];

// export const defaultProjects: Partial<Project>[] = new Array(10)
//   .fill(0)
//   .map(() => createProject());

// function createProject(): Partial<Project> {
//   return {
//     author: faker.name.findName(),
//     title: faker.lorem.sentence(),
//     content: faker.lorem.paragraphs(),
//     datetime: faker.date.recent(10),
//     likes: 0,
//   };
// }
