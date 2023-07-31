import request from "./lib/api";
import type { Project, ProjectFile, ProjectLink } from "./types";
import { Resource } from "./lib/resource";

class ProjectResource extends Resource<Project> {
  constructor() {
    super("/projects");
  }

  async linkProjectFile(userId: string, projectId: number, projectFileId: number) {
    return request(`/users/${userId}/project-files/${projectFileId}`, "PATCH", {
      projectId: projectId,
    }).then((res) => {
      return res.data;
    });
  }

  async addProjectLink(projectId: number, link: string) {
    return request(`${this.baseURL}/${projectId}/project-links`, "POST", { link: link }).then((res) => {
      return res.data;
    });
  }

  async getFeatured() {
    return request<Project[]>(`${this.baseURL}/featured`, "GET", {});
  }

  async getProjectFiles(id: string) {
    return request<ProjectFile[]>(`${this.baseURL}/${id}/project-files`, "GET", {});
  }

  async getProjectLinks(id: string) {
    return request<ProjectLink[]>(`${this.baseURL}/${id}/project-links`, "GET", {});
  }

  async getProjectComments(id: string) {
    return request<Project[]>(`${this.baseURL}/${id}/project-comments`, "GET", {});
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