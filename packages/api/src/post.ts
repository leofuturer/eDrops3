import { Post } from "./lib/types";
import { Resource } from "./lib/resource";
import { request } from "./lib/api";

class PostResource extends Resource<Post> {
  constructor() {
    super("/posts");
  }

  async getFeatured() {
    return request<Post[]>(`${this.baseURL}/featured`, "GET", {});
  }

  async getPostComments(id: string) {
    return request<Post[]>(`${this.baseURL}/${id}/postComments`, "GET", {});
  }

}

export const post = new PostResource();