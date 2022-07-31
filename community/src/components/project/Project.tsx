import { BookmarkIcon, ChevronLeftIcon } from "@heroicons/react/outline";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import API from "../../api/api";
import { project, userSavedProjects } from "../../api/serverConfig";
import { timeAgo } from "../../lib/time";
import { ProjectType } from "../../lib/types";

function Project() {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);

	const [currentProject, setCurrentProject] = useState<ProjectType>(
		{} as ProjectType
	);
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		API.Request(project.replace("id", id as string), "GET", {}, false).then(
			(res) => {
				setCurrentProject(res.data);
				setLoading(false);
			}
		);
	}, [id]);

	useEffect(() => {
		if (currentProject.id) {
			API.Request(
				`${userSavedProjects.replace(
					"id",
					Cookies.get("userId") as string
				)}/${currentProject.id}`,
				"GET",
				{},
				true
			)
				.then((res) => {
					if (res.data) {
						setSaved(true);
					} else {
						setSaved(false);
					}
				})
				.catch((err: AxiosError) => {
					console.log(err);
				});
		}
	}, [currentProject]);

	function handleSave() {
		API.Request(
			`${userSavedProjects.replace(
				"id",
				Cookies.get("userId") as string
			)}/${currentProject.id}`,
			"GET",
			{},
			true
		)
			.then((res) => {
				if (res.data) {
					API.Request(
						`${userSavedProjects.replace(
							"id",
							Cookies.get("userId") as string
						)}/${currentProject.id}`,
						"DELETE",
						{},
						true
					).then((res) => {
						setSaved(false);
					});
				} else {
					API.Request(
						`${userSavedProjects.replace(
							"id",
							Cookies.get("userId") as string
						)}/${currentProject.id}`,
						"POST",
						{},
						true
					).then((res) => {
						setSaved(true);
					});
				}
			})
			.catch((err: AxiosError) => {
				console.log(err);
			});
	}

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
								<BookmarkIcon
									className={`w-10 h-10 cursor-pointer ${
										saved ? "fill-black" : ""
									}`}
									onClick={handleSave}
								/>
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
