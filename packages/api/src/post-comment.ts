import { request } from "./lib/api";
import { Resource } from "./lib/resource";
import { PostComment } from "./types";

class PostCommentResource extends Resource<PostComment> {
  constructor() {
    super("/post-comments");
  }

  async getPostComments(id: number) {
    return request<PostComment[]>(`${this.baseURL}/${id}/postComments`, "GET", {});
  }
}

export const postComment = new PostCommentResource();