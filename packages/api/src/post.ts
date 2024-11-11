import { Post, Comment } from "./lib/types";
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
    const url = this.baseURL.replace("/posts", "");
    return request<Comment[]>(`${url}/comments/post/${id}`, "GET", {}).then((res) => {
      return res.data;
    });
  }

  async addPostComment(id: typeof Post.prototype.id, comment: Comment) {
    const url = this.baseURL.replace("/posts", "");
    return request<Comment>(`${url}/comments/post/${id}`, "POST", comment).then((res) => {
      return res.data;
    });
  }

}

export const post = new PostResource();