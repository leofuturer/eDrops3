import Cookies from "js-cookie";
import api from "./api";
import { projectFiles, projectLinks } from "./serverConfig";

export async function linkProjectFile(projectId: number, projectFileId: number) {
	return api
		.Request(
			`${projectFiles.replace("id", Cookies.get("userId") as string)}/${projectFileId}`,
			"PATCH",
			{ projectId: projectId },
			true
		)
		.then((res) => {
      // console.log(res);
			return res.data;
		})
		.catch((err) => {
			console.error(err);
		});
}

export async function addProjectLink(projectId: number, link: string) {
  return api
    .Request(
      `${projectLinks.replace("id", projectId.toString())}`,
      "POST",
      { link: link },
      true
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
    });
}