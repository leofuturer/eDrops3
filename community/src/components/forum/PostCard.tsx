import { NavLink } from "react-router-dom";
import { Post } from "@edroplets/api";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { ChatBubbleBottomCenterTextIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";

function PostCard({ post }: { post: Post }) {
	return (
		<NavLink to={`/forum/${post.id}`} className="h-full">
			<div className="h-full w-full rounded-2xl shadow-xl bg-white flex flex-row items-center">
				<div className="relative w-full flex flex-col bg-slate-300 hover:bg-slate-500 hover:text-white justify-start h-full group rounded-2xl">
					<div className="w-full rounded-2xl p-4 flex flex-col space-y-2">
						<h3 className="w-full line-clamp-3 text-2xl">
							{post.title}
						</h3>
						<p className="w-full line-clamp-1 text-sm flex items-center space-x-1">
							<UserCircleIcon className="h-6 w-6" /><p>{post.author} </p>
							<p>&#183;</p>
							<p>{new Date(post.datetime).toLocaleDateString()}</p>
						</p>
						<p className="w-full line-clamp-4 text-sm">
							{post.content}
						</p>
					</div>
					{/* <div className="absolute inset-0 w-full h-full p-4 bg-gray-500/50 rounded-2xl invisible group-hover:visible flex flex-col justify-end">
					<h3 className="w-full line-clamp-2 text-md font-bold">{project.title}</h3>
					<p className="w-full line-clamp-1 text-sm">{project.author}</p>
					<p className="w-full line-clamp-3 text-sm">
						{project.content}
					</p>
					<p className="w-full line-clamp-1">
						{new Date(project.datetime).toLocaleDateString()}
					</p>
				</div> */}
				{/* <div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2">
							<HandThumbUpIcon className="h-6" />
							<p>{post.likes}</p>
						</div>
						<div className="flex items-center space-x-2">
							<ChatBubbleBottomCenterTextIcon className="h-6" />
							<p>{post.comments}</p>
						</div>
					</div> */}
				</div>
			</div>
		</NavLink>
	);
}

export default PostCard;
