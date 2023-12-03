import { NavLink } from "react-router-dom";
import { Project as ProjectType, api } from "@edroplets/api";
import { useEffect, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

function ProjectCard({ project }: { project: ProjectType }) {

	const [coverImageId, setCoverImageId] = useState(-1);
	useEffect(() => {
		api.project.getProjectFiles(project.id).then((files) => {
			const images = files.filter((file) => file.fileType === "image");
			if (images.length === 0) {
				setCoverImageId(-1);
			}
			else {
				setCoverImageId(images[0].id ?? -1);
			}
		})
	}, [project.id]);

	return (
		<NavLink to={`/project/${project.id}`} className="h-full">
			<div className="relative w-full flex flex-col justify-end items-center h-full group bg-gray-500/50 rounded-2xl ">
				{coverImageId !== -1 &&
					<div className="absolute h-full rounded-2xl flex justify-center opacity-20">
						<img src={`/api/project-files/${coverImageId}/download`} alt={project.title} className="rounded-2xl"
						/>
					</div>}
				<div className="z-10 inset-0 w-full h-full p-4  flex flex-col space-y-2 justify-start">
					<h3 className="w-full line-clamp-3 text-xl font-bold">
						{project.title}
					</h3>
					<p className="w-full line-clamp-1 text-sm flex items-center space-x-1">
						<UserCircleIcon className="h-6 w-6"/><p>{project.author}</p>
					</p>
					{/* <p className="w-full line-clamp-4 text-sm">
						{project.content}
					</p> */}
					{/* <p className="w-full line-clamp-1">
							{new Date(project.datetime).toLocaleDateString()}
						</p> */}
				</div>
			</div>
		</NavLink>
	);
}

export default ProjectCard;
