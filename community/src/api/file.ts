import { projectFiles } from "../api/serverConfig";
import API from "../api/api";

// Upload files to the server, and return the file names (uuids) on the server
export async function uploadFiles(files: File[]): Promise<void> {
	return API.Request(projectFiles, "POST", {}, true)
		.then((res) => {
			console.log(res);
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
		});
}
