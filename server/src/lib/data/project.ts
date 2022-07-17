import {Project} from '../../models';
import {faker} from '@faker-js/faker';

export const defaultProjects: Project[] = new Array(10)
  .fill(0)
  .map(() => createProject());

function createProject(): Project {
  return {
    author: faker.name.findName(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    datetime: faker.date.past().toISOString(),
    likes: Math.random() * 100,
    dislikes: Math.random() * 100,
  } as Project;
}
