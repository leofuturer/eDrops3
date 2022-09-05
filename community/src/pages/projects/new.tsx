import {
	LinkIcon,
	PaperClipIcon,
	PhotographIcon,
	VideoCameraIcon,
} from "@heroicons/react/solid";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { userProjects } from "../../api/serverConfig";
import FileUpload from "../../components/project/FileUpload";
import { ProjectType } from "../../lib/types";

function NewProject() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [showModal, setShowModal] = useState(false);

	const navigate = useNavigate();

	function handlePost() {
		const data: Partial<ProjectType> = {
			title,
			content,
			author: "",
			datetime: new Date(),
			likes: 0,
			// dislikes: 0,
		};
		console.log(data);
		API.Request(
			userProjects.replace("id", Cookies.get("userId") as string),
			"POST",
			data,
			true
		)
			.then((res) => navigate(`/project/${res.data.id}`))
			.catch((err) => console.log(err));
	}

	function handleImage() {}

	function handleVideo() {}

	// Since the project hasn't been created yet, we should upload the files, then link them to the project after creation?
	function handleFile() {
		setShowModal(true);
	}

	function handleLink() {}

	return (
		<>
			<section className="bg-slate-200 h-[calc(100vh-80px)] py-20 px-40 flex flex-col space-y-4">
				<div className="flex flex-col space-y-4 h-full">
					<input
						type="text"
						value={title}
						placeholder="Title"
						onChange={(e) => setTitle(e.target.value)}
						className="p-2 rounded-lg shadow-lg"
					/>
					<textarea
						placeholder="Description"
						value={content}
						className="p-2 rounded-lg shadow-lg resize-none h-full"
						onChange={(e) => setContent(e.target.value)}
					/>
				</div>
				<div className="grid grid-cols-6 gap-2">
					<button
						type="button"
						className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
						onClick={handleImage}
					>
						<PhotographIcon className="h-6 w-6" />
						<p>Image</p>
					</button>
					<button
						type="button"
						className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
						onClick={handleVideo}
					>
						<VideoCameraIcon className="h-6 w-6" />
						<p>Video</p>
					</button>
					<button
						type="button"
						className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
						onClick={handleFile}
					>
						<PaperClipIcon className="h-6 w-6" />
						<p>File</p>
					</button>
					<button
						type="button"
						className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
						onClick={handleLink}
					>
						<LinkIcon className="h-6 w-6" />
						<p>Link</p>
					</button>
					<button
						type="button"
						className="bg-sky-800 text-white font-semibold rounded-lg shadow-lg flex flex-row justify-center items-center p-4 col-end-7 col-span-1"
						onClick={handlePost}
					>
						Post
					</button>
				</div>
			</section>
			{showModal && (
				<div
					id="modal"
					className="absolute inset-0 bg-slate-900 bg-opacity-50 z-50 flex items-center justify-center"
				>
					<FileUpload handleClose={() => setShowModal(false)}/>
				</div>
			)}
		</>
	);
}

export default NewProject;
