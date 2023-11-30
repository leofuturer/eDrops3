import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Project as ProjectType, api } from "@edroplets/api";
import { BookmarkIcon, ChatBubbleBottomCenterTextIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { useCookies } from "react-cookie";
import { AxiosError } from "axios";
import { UserCircleIcon } from "@heroicons/react/24/solid";

function ProjectPreview({ project }: { project: ProjectType }) {
	const [coverImageId, setCoverImageId] = useState(-1);
	const [saved, setSaved] = useState<boolean>(false);
	const [cookies] = useCookies(["userId"]);
	const navigate = useNavigate();

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

	useEffect(() => {
		if (project.id && cookies.userId) {
			api.user.getSavedProject(cookies.userId, project.id).then((res) => {
				setSaved(!!res);
			});
		}
	}, [project, cookies.userId]);

	function handleSave(e: React.MouseEvent) {
		e.preventDefault();
		if (!cookies.userId) { navigate("/login"); return; }
		api.user.saveProject(cookies.userId, project.id as number)
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
			to={`/project/${project.id}`}
			className="w-full flex flex-col items-center cursor-pointer rounded-2xl mb-4 bg-white shadow-2xl"
		>

			<div className="w-full flex flex-col space-y-4 p-4">
				<div className="flex flex-row justify-between items-center">
					<h3 className="text-xl">{project.title}</h3>
					<BookmarkIcon
						className={`w-8 h-8 cursor-default ${saved ? "fill-black" : ""
							}`}
						onClick={(e) => handleSave(e)}
					/>
				</div>
				<div className="flex flex-row space-x-2 items-center">
					<div className="flex items-center space-x-1"><UserCircleIcon className="h-6 text-gray-500" /><h3>{project.author}</h3></div>
					<p>&#183;</p>
					<p>{new Date(project.datetime).toLocaleDateString()}</p>
				</div>
				{coverImageId !== -1 &&
					<div className="h-full w-full max-h-80 flex justify-center bg-gray-900 rounded-xl">
						<img src={`/api/project-files/${coverImageId}/download`} alt={project.title} className="h-full max-h-80" />
					</div>
				}
				{coverImageId == -1 && <p className="line-clamp-2">{project.content}</p>}


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
		</NavLink>
	);
}

export default ProjectPreview;
