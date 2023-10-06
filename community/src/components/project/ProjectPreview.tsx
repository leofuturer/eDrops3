import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Project as ProjectType, api } from "@edroplets/api";

function ProjectPreview({ project }: { project: ProjectType }) {
	const [coverImageId, setCoverImageId] = useState(-1);

	useEffect(() => {
		api.project.getProjectFiles(project.id).then((files) => {
			const images = files.filter((file) => file.fileType === "image");
			if (images.length === 0) {
				setCoverImageId(-1);
			}
			else {
				setCoverImageId(images[0].id);
			}
		})
	}, [project.id]);

	return (
		<NavLink
			to={`/project/${project.id}`}
			className="w-full flex flex-col items-center cursor-pointer rounded-2xl mb-4 bg-white shadow-2xl"
		>
			{coverImageId !== -1 &&
				<div className="w-full h-80 max-h-40 flex justify-center bg-gray-900 rounded-t-2xl">
					<img src={`/api/project-files/${coverImageId}/download`} alt={project.title} className="h-full" />
				</div>
			}
			<div className="w-full flex flex-col p-4">
				<div className="flex flex-row justify-between">
					<h3>{project.title}</h3>
					<h3>{project.author}</h3>
				</div>
				{coverImageId == -1 && <p className="line-clamp-2">{project.content}</p> }
				<p>{new Date(project.datetime).toLocaleDateString()}</p>
			</div>
		</NavLink>
	);
}

export default ProjectPreview;
