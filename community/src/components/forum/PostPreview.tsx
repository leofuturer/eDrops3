import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Post, Project, api } from "@edroplets/api";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { BookmarkIcon, ChatBubbleBottomCenterTextIcon, ChatBubbleLeftIcon, HandThumbUpIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useCookies } from "react-cookie";
import { AxiosError } from "axios";

function PostPreview({ post, handleDelete }: { post: Post, handleDelete: Function }) {

	const [saved, setSaved] = useState<boolean>(false);
	const [cookies] = useCookies(["userId"]);
	const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
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
			className="w-full flex flex-col items-center cursor-pointer rounded-2xl mb-4 bg-white shadow-2xl z-0"
		>
			<div className="w-full flex flex-col space-y-4 p-4">
				<div className="flex flex-row justify-between items-center">
					<h3 className="text-xl">{post.title}</h3>
					<div className="flex flex-row">
						{
							(post.userId===cookies.userId) ?
								<div className="flex flex-col">
									<EllipsisHorizontalIcon
										className={`w-10 h-10 z-100 cursor-default`}
										onClick={(e) => {
											e.preventDefault();
											setDropdownVisible(!dropdownVisible);
										}}
									/>
									<div style={{display: dropdownVisible ? "block" : "none"}} className="absolute mt-8 -ml-9">
										<ul className="text-white bg-slate-700 p-2 px-3 rounded">
											<li>
												<button
													onClick={(e)=> {
														e.preventDefault();
														console.log("editing");
														navigate(`/forum/new?edit=true&id=${post.id}`);
													}}
												>
													Edit
												</button>
											</li>
											<li>
												<button
													onClick={(e) => {
														// have parent class handle this
														e.preventDefault();
														handleDelete();
														setDropdownVisible(false);
													}}
												>
													Delete
												</button>
											</li>
										</ul>
									</div>
								</div> 
								: 
								<></>
						}
						<BookmarkIcon
							className={`w-8 h-8 cursor-default ${saved ? "fill-black" : ""
								}`}
							onClick={(e) => handleSave(e)}
						/>
					</div>
					
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
