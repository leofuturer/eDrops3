import { NavLink } from "react-router-dom";
import { Project as ProjectType, api } from "@edroplets/api";
import { useEffect, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { ChatBubbleBottomCenterTextIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";

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
			<div className="relative w-full flex flex-col justify-end items-center h-full group bg-gray-500/50 hover:bg-gray-500/70 rounded-2xl ">
				{coverImageId !== -1 &&
					<div className="absolute w-full h-full rounded-2xl flex justify-center items-center opacity-20">
						<img src={`/api/project-files/${coverImageId}/download`} alt={project.title} className="rounded-2xl object-cover w-full max-h-full"
						/>
					</div>}
				<div className="z-10 inset-0 w-full h-full p-4  flex flex-col space-y-2 justify-start">
					<h3 className="w-full line-clamp-3 text-lg lg:text-xl 2xl:text-2xl">
						{project.title}
					</h3>
					<p className="w-full line-clamp-1 text-sm flex items-center space-x-1">
						<UserCircleIcon className="h-6 w-6" /><p>{project.author}</p>
						<p>&#183;</p>
						<p>{new Date(project.datetime).toLocaleDateString()}</p>
					</p>
					{/* <p className="w-full line-clamp-4 text-sm">
						{project.content}
					</p> */}
					{/* <p className="w-full line-clamp-1">
							{new Date(project.datetime).toLocaleDateString()}
						</p> */}
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2">
							<HandThumbUpIcon className="h-6" />
							<p>{project.likes}</p>
						</div>
						<div className="flex items-center space-x-2">
							<ChatBubbleBottomCenterTextIcon className="h-6" />
							<p>{project.comments}</p>
						</div>
					</div>
				</div>
			</div>
		</NavLink>
	);
}

export default ProjectCard;
