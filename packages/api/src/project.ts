import request from "./lib/api";
import type { Project } from "./types";
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