import { Post, PostComment } from "./lib/types";
import { Resource } from "./lib/resource";
import { request } from "./lib/api";

class PostResource extends Resource<Post> {
  constructor() {
    super("/posts");
  }

  async getFeatured() {
    return request<Post[]>(`${this.baseURL}/featured`, "GET", {}).then((res) => {
      return res.data;
    });
  }

  async getPostComments(id: typeof Post.prototype.id) {
    return request<PostComment[]>(`${this.baseURL}/${id}/post-comments`, "GET", {}).then((res) => {
      return res.data;
    });
  }

  async addPostComment(id: typeof Post.prototype.id, comment: PostComment) {
    return request<PostComment>(`${this.baseURL}/${id}/post-comments`, "POST", comment).then((res) => {
      return res.data;
    });
  }

}

export const post = new PostResource();