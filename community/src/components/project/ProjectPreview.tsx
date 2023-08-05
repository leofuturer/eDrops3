import React from "react";
import { NavLink } from "react-router-dom";
import { Project as ProjectType } from "@edroplets/api";

function ProjectPreview({ project }: { project: ProjectType }) {
	return (
		<NavLink
			to={`/project/${project.id}`}
			className="w-full flex flex-col items-center cursor-pointer rounded-2xl mb-4 bg-white shadow-2xl"
		>
			<div className="w-full h-40 rounded-t-2xl bg-gray-400">
				{/* <img src={project.image} alt={project.title} className="w-full h-full rounded-2xl" /> */}
			</div>
			<div className="w-full flex flex-col p-4">
				<div className="flex flex-row justify-between">
					<h3>{project.title}</h3>
					<h3>{project.author}</h3>
				</div>

				{/* <p>{project.content}</p> */}
				<p>{new Date(project.datetime).toLocaleDateString()}</p>
			</div>
		</NavLink>
	);
}

export default ProjectPreview;
