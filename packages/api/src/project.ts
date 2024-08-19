import request from "./lib/api";
import type { Project, Comment, ProjectFile, ProjectLink, User } from "./lib/types";
import { Resource } from "./lib/resource";

class ProjectResource extends Resource<Project> {
  constructor() {
    super("/projects");
  }

  async linkProjectFile(userId: typeof User.prototype.id, projectId: typeof Project.prototype.id, projectFileId: typeof ProjectFile.prototype.id) {
    return request(`/users/${userId}/project-files/${projectFileId}`, "PATCH", {
      projectId: projectId,
    }).then((res) => {
      return res.data;
    });
  }

  async delinkProjectFile(userId: typeof User.prototype.id, projectId: typeof Project.prototype.id, projectFileId: typeof ProjectFile.prototype.id) {
    return request(`/users/${userId}/project-files/${projectFileId}`, "DELETE", {}).then((res) => {
      return res.data;
    });
  }

  async addProjectLink(projectId: typeof Project.prototype.id, link: string) {
    return request(`${this.baseURL}/${projectId}/project-links`, "POST", { link: link }).then((res) => {
      return res.data;
    });
  }

  async removeProjectLink(projectId: typeof Project.prototype.id, link: string) {
    return request(`${this.baseURL}/${projectId}/project-links/delete`, "POST", { link: link }).then((res) => {
      return res.data;
    });
  }

  async getFeatured() {
    return request<Project[]>(`${this.baseURL}/featured`, "GET", {}).then((res) => {
      return res.data;
    });
  }

  async getProjectFiles(id: typeof Project.prototype.id) {
    return request<ProjectFile[]>(`${this.baseURL}/${id}/project-files`, "GET", {}).then((res) => {
      return res.data;
    });
  }

  async getProjectLinks(id: typeof Project.prototype.id) {
    return request<ProjectLink[]>(`${this.baseURL}/${id}/project-links`, "GET", {}).then((res) => {
      return res.data;
    });
  }

  async getProjectComments(id: typeof Project.prototype.id) {
    const url = this.baseURL.replace("/projects", "");
    return request<Comment[]>(`${url}/comments/project/${id}`, "GET", {}).then((res) => {
      return res.data;
    });
  }

  async addProjectComment(id: typeof Project.prototype.id, comment: Comment) {
    const url = this.baseURL.replace("/projects", "");
    return request<Comment>(`${url}/comments/project/${id}`, "POST", comment).then((res) => {
      return res.data;
    });
  }

}

export const project = new ProjectResource();

// export async function linkProjectFile(projectId: number, projectFileId: number) {
// 	return api
// 		.Request(
// 			`${projectFiles.replace("id", Cookies.get("userId") as string)}/${projectFileId}`,
// 			"PATCH",
// 			{ projectId: projectId },
// 			true
// 		)
// 		.then((res) => {
//       // console.log(res);
// 			return res.data;
// 		})
// 		.catch((err) => {
// 			console.error(err);
// 		});
// }

// export async function addProjectLink(projectId: number, link: string) {
//   return api
//     .Request(
//       `${projectLinks.replace("id", projectId.toString())}`,
//       "POST",
//       { link: link },
//       true
//     )
//     .then((res) => {
//       return res.data;
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// }