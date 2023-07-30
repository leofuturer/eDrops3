import { projectFiles } from "./serverConfig";
import { request } from "./lib/api";
import { DTO, ProjectFile } from "./types";
import { Resource } from "./lib/resource";

class ProjectFileResource extends Resource<ProjectFile> {
	constructor() {
		super("/project-files");
	}
}

export const projectFile = new ProjectFileResource();

// Upload files to the server, and return the file names (uuids) on the server
export async function uploadFiles(
	userId: string,
	files: File[],
	// fields: object = { isPublic: "public" },
): Promise<DTO<ProjectFile>[]> {
	const headers = { "Content-Type": "multipart/form-data" };
	const formData = new FormData();
	files.forEach((file) => {
		// Use fieldname "community" to specify community folder (easiest way)
		formData.append("community", file);
	});
	// console.log(files);
	// formData.append("fields", JSON.stringify(fields));
	return request<DTO<ProjectFile>[]>(projectFiles.replace('id', userId), "POST", formData, headers)
		.then((res) => {
			// console.log(res);
			return res.data;
			// const promises : Promise<object>[] = [];
			// res.data.forEach((e) => {
			// 	promises.push(
			// 		new Promise((resolve, reject) => {
			// 			if (
			// 				e.fileName === file.name &&
			// 				!e.isDeleted &&
			// 				!_this.state.checked
			// 			) {
			// 				// console.log(e);
			// 				_this.setState({ originalName: file.name });
			// 				reject("Duplicate file found");
			// 			} else {
			// 				resolve();
			// 			}
			// 		})
			// 	);
			// });
			// Promise.all(promises)
			// 	.then(() => {
			// 		// No duplicate files found
			// 		this.uploadFileRequest({
			// 			isPublic: this.state.public,
			// 			unit: this.state.unit,
			// 		});
			// 	})
			// 	.catch((msg) => {
			// 		// console.error(err);
			// 		$("#confirmModal").modal("show");
			// 	});
		})
		.catch((err) => {
			console.error(err);
			throw err;
		});
}

export function downloadFile(
	userId: string,
	fileId: number,
): void {
	// @ts-ignore
	window.location = `${projectFiles.replace('id', userId)}/${fileId}`
// 	return request(`${projectFiles.replace('id', userId)}/${fileId}`, "GET", {}, true)
// 		.then((res) => {
// 			console.log(res);
// 			return res.data;
// 		})
// 		.catch((err) => {
// 			console.error(err);
// 		});
}