import {faker} from '@faker-js/faker';
import {Post} from '../../models';

export const defaultPosts: Post[] = new Array(10)
  .fill(0)
  .map(() => createPost());

function createPost(): Post {
  return {
    parentId: 0,
    author: faker.name.findName(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    datetime: faker.date.past().toISOString(),
    likes: Math.random() * 100,
  } as Post;
}
