import { PaperClipIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import React, { useCallback, useState } from "react";
import { useDropzone, FileWithPath, FileError } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { ProjectFile } from "../../../../server/src/models";

function FileUpload({
	handleClose,
	addFiles,
}: {
	handleClose: () => void;
	addFiles: (files: ProjectFile[]) => void;
}) {
	const navigate = useNavigate();

	const [files, setFiles] = useState<FileWithPath[]>([]);
	const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
		useDropzone({
			accept: {
				"application/octet-stream": [".dxf"],
				// Note: need to determine MIME type for actual DXF files
				// Currently using generic 'application/octet-stream' for all files
			},
			maxSize: 30 * 1000 * 1000, // 30 MB
			onDropAccepted(droppedFiles, event) {
				setFiles(files.concat(droppedFiles));
			},
			onDropRejected(rejectedFiles, event) {
				// console.log(rejectedFiles);
			},
		});

	function removeFile(file: FileWithPath) {
		setFiles(files.filter((f) => f !== file));
	}

	async function handleNext() {
		// console.log(files);
		if (files) {
			const uploadedFiles = await uploadFiles(
				Cookies.get("userId") as string,
				files
			)
				.then((files) => {
					addFiles(files);
					return files;
				})
				.catch((err: AxiosError) => {
					if (err.response?.status === 401) {
						navigate("/login");
					}
					return [];
				});
		}
		handleClose();
	}

	const acceptedFileItems = files.map((file: FileWithPath) => (
		<li
			key={file.path}
			className="bg-white flex flex-row justify-between items-center px-2"
		>
			<p>
				{file.path} - {file.size} bytes
			</p>
			<button
				type="button"
				title="Remove file"
				onClick={() => removeFile(file)}
			>
				<XMarkIcon className="h-4 w-4" />
			</button>
		</li>
	));

	return (
		<div className="h-1/2 w-1/2 bg-slate-200 rounded-xl flex flex-col space-y-2 p-4 text-slate-400">
			<div
				{...getRootProps({
					className:
						"dropzone flex-grow flex flex-col justify-center items-center border-dashed border-2 border-black/25",
				})}
			>
				<input {...getInputProps()} />
				<PaperClipIcon className="h-24 w-24" />
				<p className="text-2xl">Drag &amp; Drop</p>
				<p>or</p>
				<button
					type="button"
					className="bg-white shadow-xl rounded-lg px-4 py-2"
				>
					<p className="text-lg text-black">Upload file</p>
				</button>
			</div>
			<aside>
				<ul className="flex flex-col space-y-2">{acceptedFileItems}</ul>
			</aside>
			<button
				type="button"
				className="bg-sky-700 rounded-lg py-2 text-white"
				onClick={handleNext}
			>
				Next
			</button>
		</div>
	);
}

export default FileUpload;
