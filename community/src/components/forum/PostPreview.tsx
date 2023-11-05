import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Post, Project, api } from "@edroplets/api";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { BookmarkIcon, ChatBubbleBottomCenterTextIcon, ChatBubbleLeftIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { useCookies } from "react-cookie";
import { AxiosError } from "axios";

function PostPreview({ post }: { post: Post }) {

	const [saved, setSaved] = useState<boolean>(false);
	const [cookies] = useCookies(["userId"]);
	const navigate = useNavigate();

	useEffect(() => {
		if (post.id && cookies.userId) {
			api.user.getSavedPost(cookies.userId, post.id).then((res) => {
				setSaved(!!res);
			});
		}
	}, [post, cookies.userId]);

	function handleSave(e: React.MouseEvent) {
		e.preventDefault();
		if (!cookies.userId) { navigate("/login"); return; }
		api.user.savePost(cookies.userId, post.id as number)
			.then((res) => setSaved(res))
			.catch((err: AxiosError) => {
				if (err.message === "No access token found") {
					navigate("/login");
				}
				// console.log(err);
			});
	}

	return (
		<NavLink
			to={`/forum/${post.id}`}
			className="w-full flex flex-col items-center cursor-pointer rounded-2xl mb-4 bg-white shadow-2xl"
		>
			<div className="w-full flex flex-col space-y-4 p-4">
				<div className="flex flex-row justify-between items-center">
					<h3 className="text-xl">{post.title}</h3>
					<BookmarkIcon
						className={`w-8 h-8 cursor-default ${saved ? "fill-black" : ""
							}`}
						onClick={(e) => handleSave(e)}
					/>
				</div>
				<div className="flex flex-row space-x-2 items-center">
					<div className="flex items-center space-x-1"><UserCircleIcon className="h-6 text-gray-500" /><h3>{post.author}</h3></div>
					<p>&#183;</p>
					<p>{new Date(post.datetime).toLocaleDateString()}</p>
				</div>

				<p className="line-clamp-2">{post.content}</p>

				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2">
						<HandThumbUpIcon className="h-6" />
						<p>{post.likes}</p>
					</div>
					<div className="flex items-center space-x-2">
						<ChatBubbleBottomCenterTextIcon className="h-6" />
						<p>{post.comments}</p>
					</div>
				</div>

			</div>
		</NavLink>
	);
}

export default PostPreview;
