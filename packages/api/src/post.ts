import { Post } from "./types";
import { Resource } from "./lib/resource";

class PostResource extends Resource<Post> {
  constructor() {
    super("/posts");
  }
}

export const post = new PostResource();