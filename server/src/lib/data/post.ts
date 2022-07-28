import {faker} from '@faker-js/faker';
import {Post} from '../../models';

export const defaultPosts: Partial<Post>[] = new Array(10)
  .fill(0)
  .map(() => createPost());

function createPost(): Partial<Post> {
  return {
    parentId: 0,
    author: faker.name.findName(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    datetime: faker.date.recent(10),
    likes: Math.random() * 100,
  };
}
