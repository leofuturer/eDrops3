import { NavLink } from "react-router-dom";
import { ProjectType } from "../../lib/types";

function ProjectCard({ project }: { project: ProjectType }) {
	return (
		<NavLink to={`/project/${project.id}`}>
			<div className="w-full rounded-2xl shadow-xl bg-white flex flex-row items-center">
				<div className="relative w-full flex flex-col justify-between h-full group">
					<div className="w-full h-full rounded-2xl">
						<img
							src="/static/img/EWOD-chip-compressed.png"
							alt="Project picture"
							className="w-full h-full rounded-2xl"
						/>
					</div>
					<div className="absolute inset-0 w-full h-full p-4 bg-gray-500/50 rounded-2xl invisible group-hover:visible flex flex-col justify-end">
						<h3 className="w-full line-clamp-2 text-md font-bold">
							{project.title}
						</h3>
						<p className="w-full line-clamp-1 text-sm">
							{project.author}
						</p>
						<p className="w-full line-clamp-3 text-sm">
							{project.content}
						</p>
						<p className="w-full line-clamp-1">
							{new Date(project.datetime).toLocaleDateString()}
						</p>
					</div>
				</div>
			</div>
		</NavLink>
	);
}

export default ProjectCard;
