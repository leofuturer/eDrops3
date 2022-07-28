import {faker} from '@faker-js/faker';
import {Project} from '../../models';

export const defaultProjects: Partial<Project>[] = new Array(10)
  .fill(0)
  .map(() => createProject());

function createProject(): Partial<Project> {
  return {
    author: faker.name.findName(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    datetime: faker.date.recent(10),
    likes: Math.random() * 100,
    dislikes: Math.random() * 100,
  };
}
