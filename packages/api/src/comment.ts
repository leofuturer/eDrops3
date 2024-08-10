import { request } from "./lib/api";
import { Resource } from "./lib/resource";
import { Comment } from "./lib/types";

class CommentResource extends Resource<Comment> {
  constructor() {
    super("/comments");
  }

  async getChildComments(id: number) {
    return request<Comment[]>(`${this.baseURL}/child-comments/${id}`, "GET", {}).then(
      (res) => res.data
    );
  }

  async createChildComment(id: number, data: Comment) {
    return request<Comment>(`${this.baseURL}/child-comments/${id}`, "POST", data).then(
      (res) => res.data
    );
  }

  async deleteComment(id: number) {
    console.log(`${this.baseURL}/comments/${id}`);
    return request<Comment>(`${this.baseURL}/comments/${id}`, "DELETE", {}).then(
      (res) => res.data
    );
  }

  async editComment(id: number, data: Comment) {
    console.log(`${this.baseURL}/comments/${id}`);
    return request<Comment>(`${this.baseURL}/comments/${id}`, "PATCH", data).then(
      (res) => res.data
    );
  }
  
}

export const comment = new CommentResource();