import React from "react";
import { NavLink } from "react-router-dom";
import { PostType, ProjectType } from "../../lib/types";

function PostPreview({ post }: { post: PostType }) {
	return (
		<NavLink
			to={`/forum/${post.id}`}
			className="w-full flex flex-col items-center cursor-pointer rounded-2xl mb-4 bg-white shadow-2xl"
		>
			<div className="w-full h-40 rounded-t-2xl bg-gray-400">
				{/* <img src={project.image} alt={project.title} className="w-full h-full rounded-2xl" /> */}
			</div>
			<div className="w-full flex flex-col p-4">
				<div className="flex flex-row justify-between">
					<h3>{post.title}</h3>
					<h3>{post.author}</h3>
				</div>

				{/* <p>{project.content}</p> */}
				<p>{new Date(post.datetime).toLocaleDateString()}</p>
			</div>
		</NavLink>
	);
}

export default PostPreview;
