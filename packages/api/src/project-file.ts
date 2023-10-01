import { request } from "./lib/api";
import { Resource } from "./lib/resource";
import { ProjectFile } from "./lib/types";
import { download } from "./lib/download";

class ProjectFileResource extends Resource<ProjectFile> {
	constructor() {
		super("/project-files");
	}

  async getBlob(projectFileId: typeof ProjectFile.prototype.id): Promise<string> {
    return request<string>(`${this.baseURL}/${projectFileId}/download`, 'GET', {}).then((res) => {
      return res.data;
    });
  }

	async download(projectFileId: typeof ProjectFile.prototype.id): Promise<void> {
    request<string>(`${this.baseURL}/${projectFileId}/download`, 'GET', {}).then((res) => {
      download(res);
    });
  }
}

export const projectFile = new ProjectFileResource();