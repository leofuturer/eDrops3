import { request } from "./lib/api";
import { Resource } from "./lib/resource";
import { ProjectComment } from "./lib/types";

class ProjectCommentResource extends Resource<ProjectComment> {
  constructor() {
    super("/project-comments");
  }

  async getProjectComments(id: typeof ProjectComment.prototype.id) {
    return request<ProjectComment[]>(`${this.baseURL}/${id}/project-comments`, "GET", {}).then(
      (res) => res.data
    );
  }

  async createProjectComment(id: typeof ProjectComment.prototype.id, data: ProjectComment) {
    return request<ProjectComment>(`${this.baseURL}/${id}/project-comments`, "POST", data).then(
      (res) => res.data
    );
  }
}

export const projectComment = new ProjectCommentResource();