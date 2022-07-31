import { NavLink } from "react-router-dom";
import { PostType } from "../../lib/types";

function PostCard({ post }: { post: PostType }) {
	return (
		<NavLink to={`/forum/${post.id}`} className="h-full">
			<div className="h-full w-full rounded-2xl shadow-xl bg-white flex flex-row items-center">
				<div className="relative w-full flex flex-col bg-slate-300 hover:bg-slate-700 hover:text-white justify-end h-full group rounded-2xl">
					<div className="w-full rounded-2xl p-4">
						<h3 className="w-full line-clamp-2 text-md font-bold">
							{post.title}
						</h3>
						<p className="w-full line-clamp-6 text-sm">
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
				</div>
			</div>
		</NavLink>
	);
}

export default PostCard;
