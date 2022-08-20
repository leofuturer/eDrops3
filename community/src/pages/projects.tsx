import React, { useState, useEffect, useMemo } from "react";
import ProjectPreview from "../components/project/ProjectPreview";
import API from "../api/api";
import { projects } from "../api/serverConfig";
import { ProjectType } from "../lib/types";
import { debounce } from "lodash";
import { SearchIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { NavLink } from "react-router-dom";
import ProfilePreview from "../components/profile/ProfilePreview";

function Projects() {
	const [projectList, setProjectList] = useState<ProjectType[]>([]);
	const [sortedProjects, setSortedProjects] = useState<ProjectType[]>([]);
	const [search, setSearch] = useState("");
	const [feedType, setFeedType] = useState<"Featured" | "New">("Featured");

	useEffect(() => {
		let filter = {};
		if (search !== "") {
			// filter = {
			//     where: {
			//         title: { match: search },
			//     },
			// };
			filter = {
				where: {
					or: [
						{
							title: {
								regexp: `/${search}/i`,
							},
						},
						{
							author: {
								regexp: `/${search}/i`,
							},
						},
					],
				},
			};
		}
		API.Request(projects, "GET", filter, false).then((res) => {
			setProjectList(res.data);
		});
	}, [search]);

	useEffect(() => {
		const sortedProjects = ([] as ProjectType[]).concat(projectList)
		if (feedType === "Featured") {
			sortedProjects.sort((a, b) => (a.likes < b.likes ? 1 : -1));
		} else if (feedType === "New") {
			sortedProjects.sort((a, b) => (a.datetime < b.datetime ? 1 : -1));
		}
		setSortedProjects(sortedProjects);
	}, [feedType, projectList]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		console.log(e.target.value);
	};

	const debounceSearch = useMemo(() => {
		return debounce(handleSearch, 300);
	}, []);

	useEffect(() => debounceSearch.cancel());

	return (
		<section className="min-h-full bg-slate-200 grid grid-cols-4">
			<ProfilePreview />
			<div className="col-span-2 flex flex-col">
				<div className="w-full flex flex-row py-4 h-20 space-x-4">
					<div className="relative w-4/5 h-full">
						<input
							type="text"
							placeholder="Search projects"
							onChange={debounceSearch}
							className="w-full h-full rounded-2xl p-2"
						/>
						<SearchIcon className="absolute top-4 right-4 h-4 w-4 text-slate-400" />
					</div>
					<div className="w-1/5 h-full">
						<NavLink to="/projects/new">
							<button
								type="button"
								className="bg-sky-800 text-white rounded-2xl w-full h-full hidden lg:flex items-center justify-center"
							>
								New Project
							</button>
                            <button
                                title="New"
								type="button"
								className="bg-sky-800 text-white rounded-2xl w-full h-full flex lg:hidden items-center justify-center"
							>
								<PlusIcon className="h-4 w-4" />
							</button>
						</NavLink>
					</div>
				</div>
				<div id="projectList">
					{sortedProjects.map((project) => (
						<ProjectPreview project={project} key={project.id}/>
					))}
				</div>
			</div>
			<div className="flex flex-col px-10 mt-20">
				<div className="flex flex-col sticky top-20 space-y-4">
					<div
						className={`py-2 px-4 justify-center items-center rounded-3xl ${
							feedType === "Featured"
								? "bg-sky-800 text-white"
								: ""
						}`}
						onClick={() => setFeedType("Featured")}
					>
						<p className="text-2xl text-center">Featured</p>
					</div>
					<div
						className={`py-2 px-4 justify-center items-center rounded-3xl ${
							feedType === "New" ? "bg-sky-800 text-white" : ""
						}`}
						onClick={() => setFeedType("New")}
					>
						<p className="text-2xl text-center">New</p>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Projects;
