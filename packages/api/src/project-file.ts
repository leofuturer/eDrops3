import { Resource } from "./lib/resource";
import { ProjectFile } from "./lib/types";

class ProjectFileResource extends Resource<ProjectFile> {
	constructor() {
		super("/project-files");
	}
}

export const projectFile = new ProjectFileResource();