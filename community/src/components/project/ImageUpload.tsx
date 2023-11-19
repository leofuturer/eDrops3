import { ProjectFile, api } from "@edroplets/api";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { AxiosError } from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { FileWithPath, useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

function ImageUpload({
	handleClose,
	addFiles,
}: {
	handleClose: () => void;
	addFiles: (files: ProjectFile[]) => void;
}) {
	const navigate = useNavigate();
	const [cookies] = useCookies(["userId"]);

	const [files, setFiles] = useState<FileWithPath[]>([]);
	const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
		useDropzone({
			accept: {
				"image/*": [".png", ".jpg", ".jpeg"],
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
		if(!cookies.userId) {navigate("/login"); return;}
		// console.log(files);
		if (files) {
			const formData = new FormData();
			files.forEach((file) => {
				formData.append("community", file);
			});
			api.user.uploadProjectFiles(cookies.userId, formData).then((files) => {
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
		<>
			<div
				{...getRootProps({
					className:
						"dropzone flex-grow flex flex-col justify-center items-center border-dashed border-2 border-black/25 py-4",
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
		</>
	);
}

export default ImageUpload;
