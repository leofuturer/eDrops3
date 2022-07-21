import { BookmarkIcon, ChevronLeftIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import API from "../../api/api";
import { project } from "../../api/serverConfig";
import { timeAgo } from "../../lib/time";
import { ProjectType } from "../../lib/types";

function Project() {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);

	const [currentProject, setCurrentProject] = useState<ProjectType>({} as ProjectType);

	useEffect(() => {
		API.Request(project.replace("id", id as string), "GET", {}, false).then(
			(res) => {
				setCurrentProject(res.data);
				setLoading(false);
			}
		);
	}, [id]);

	return (
		<section className="relative bg-slate-200 h-full py-10 grid grid-cols-5">
			<div className="flex flex-col items-center">
				<div className="h-10 w-10">
					<NavLink to="/projects">
						<ChevronLeftIcon />
					</NavLink>
				</div>
			</div>
			<div className="col-span-3 flex flex-col space-y-4">
				{!loading && (
					<>
						<div className="flex flex-col">
							<div className="flex flex-row w-full justify-between">
								<h1 className="text-3xl">
									{currentProject?.title}
								</h1>
								<BookmarkIcon className="h-10 w-10" />
							</div>

							<p className="text-md">
								{currentProject?.author} &#8226;{" "}
								{timeAgo(new Date(currentProject.datetime))}
							</p>
						</div>
						<div>{currentProject?.content}</div>
					</>
				)}
			</div>
		</section>
	);
}

export default Project;
