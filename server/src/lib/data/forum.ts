import {faker} from '@faker-js/faker';
import {Forum} from '../../models';

export const defaultForums: Forum[] = new Array(10)
  .fill(0)
  .map(() => createForum());

function createForum(): Forum {
  return {
    parentId: 0,
    author: faker.name.findName(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    datetime: faker.date.past().toISOString(),
    likes: Math.random() * 100,
  } as Forum;
}
