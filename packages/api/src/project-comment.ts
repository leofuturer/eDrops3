import { request } from "./lib/api";
import { Resource } from "./lib/resource";
import { ProjectComment } from "./lib/types";

class ProjectCommentResource extends Resource<ProjectComment> {
  constructor() {
    super("/project-comments");
  }

  async getProjectComments(id: string) {
    return request<ProjectComment[]>(`${this.baseURL}/${id}/project-comments`, "GET", {});
  }
}

export const projectComment = new ProjectCommentResource();