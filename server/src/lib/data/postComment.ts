import {faker} from '@faker-js/faker';
import {PostComment} from '../../models';

export function createPostComment(userId?: string): Partial<PostComment> {
  return {
    author: faker.name.findName(),
    content: faker.lorem.paragraphs(),
    datetime: faker.date.recent(10),
    likes: Math.random() * 100,
    userId,
  };
}