import {
	LinkIcon,
	PaperClipIcon,
	PhotoIcon,
	VideoCameraIcon,
} from "@heroicons/react/24/solid";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api";
import { PostType, ProjectType } from "../../lib/types";
import { request } from "@edroplets/api";

export function NewForum() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const navigate = useNavigate();

	function handlePost() {
		const data: Partial<PostType> = {
			title,
			content,
			author: "",
			datetime: new Date(),
			likes: 0,
			// dislikes: 0,
		};
		// console.log(data);
		request(
			userPosts.replace("id", Cookies.get("userId") as string),
			"POST",
			data,
		)
			.then((res) => navigate(`/forum/${res.data.id}`))
			.catch((err: AxiosError) => {
				if (err.response?.status === 401) {
					navigate("/login");
				}
				console.log(err);
			});
	}

	return (
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
				>
					<PhotoIcon className="h-6 w-6" />
					<p>Image</p>
				</button>
				<button
					type="button"
					className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
				>
					<VideoCameraIcon className="h-6 w-6" />
					<p>Video</p>
				</button>
				<button
					type="button"
					className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
				>
					<PaperClipIcon className="h-6 w-6" />
					<p>File</p>
				</button>
				<button
					type="button"
					className="bg-slate-400 text-black rounded-lg shadow-lg flex flex-row space-x-2 justify-center items-center p-4"
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
	);
}

export default NewForum;
