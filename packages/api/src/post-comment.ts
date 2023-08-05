import { request } from "./lib/api";
import { Resource } from "./lib/resource";
import { PostComment } from "./lib/types";

class PostCommentResource extends Resource<PostComment> {
  constructor() {
    super("/post-comments");
  }

  async getPostComments(id: number) {
    return request<PostComment[]>(`${this.baseURL}/${id}/post-comments`, "GET", {}).then(
      (res) => res.data
    );
  }

  async createPostComment(id: number, data: PostComment) {
    return request<PostComment>(`${this.baseURL}/${id}/post-comments`, "POST", data).then(
      (res) => res.data
    );
  }
}

export const postComment = new PostCommentResource();