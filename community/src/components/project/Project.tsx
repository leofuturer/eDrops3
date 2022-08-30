import {
	AnnotationIcon,
	BookmarkIcon,
	ChatAlt2Icon,
	ChevronLeftIcon,
	ThumbUpIcon,
} from "@heroicons/react/outline";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import API from "../../api/api";
import { checkReact, react } from "../../api/react";
import { project } from "../../api/serverConfig";
import { timeAgo } from "../../lib/time";
import { ProjectType } from "../../lib/types";

function Project() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	const [currentProject, setCurrentProject] = useState<ProjectType>(
		{} as ProjectType
	);
	const [saved, setSaved] = useState<boolean>(false);
	const [liked, setLiked] = useState<boolean>(false);

	// Fetch current project and set loading to false after fetch
	useEffect(() => {
		API.Request(project.replace("id", id as string), "GET", {}, false).then(
			(res) => {
				setCurrentProject(res.data);
				setLoading(false);
			}
		);
	}, [id]);

	// Check if project is saved initially
	useEffect(() => {
		if (currentProject.id) {
			checkReact(
				"Project",
				"Save",
				Cookies.get("userId") as string,
				currentProject.id
			).then((res: boolean) => {
				setSaved(res);
			});
		}
	}, [currentProject]);

	// Check if project is liked initially
	useEffect(() => {
		if (currentProject.id) {
			checkReact(
				"Project",
				"Like",
				Cookies.get("userId") as string,
				currentProject.id
			).then((res: boolean) => {
				setLiked(res);
			});
		}
	}, [currentProject]);

	function handleSave() {
		react(
			"Project",
			"Save",
			Cookies.get("userId") as string,
			currentProject.id as number
		)
			.then((res: boolean) => setSaved(res))
			.catch((err: AxiosError) => {
				if (err.message === "No access token found") {
					navigate("/login");
				}
				// console.log(err);
			});
	}

	function handleLike() {
		react(
			"Project",
			"Like",
			Cookies.get("userId") as string,
			currentProject.id as number
		)
			.then((res: boolean) => {
				setLiked(res);
				currentProject.likes = res
					? currentProject.likes + 1
					: currentProject.likes - 1;
			})
			.catch((err: AxiosError) => {
				if (err.message === "No access token found") {
					navigate("/login");
				}
				// console.log(err);
			});
	}

	return (
		<section className="relative bg-slate-200 min-h-full py-10 grid grid-cols-5">
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
						<div className="flex flex-row space-x-4">
							<div
								className="flex flex-row space-x-2 cursor-pointer"
								onClick={handleLike}
							>
								<ThumbUpIcon
									className={`w-6 h-6 cursor-pointer ${
										liked ? "fill-black" : ""
									}`}
								/>
								<p className="text-md">
									{currentProject?.likes}
								</p>
							</div>
							{/* <div className="flex flex-row space-x-2">
								<ThumbDownIcon className="w-10 h-10" />
								<p className="text-md">
									{currentProject?.dislikes}
								</p>
							</div> */}
							<div className="flex flex-row space-x-2">
								<AnnotationIcon className="w-6 h-6" />
								<p className="text-md">Comment</p>
							</div>
						</div>
						<div className="flex flex-row space-x-2 border-b-2 border-black pb-2">
							<h3 className="text-xl">Comments</h3>
							<ChatAlt2Icon className="w-6 h-6" />
							<p className="text-md"></p>
						</div>
						<div>adsf</div>
					</>
				)}
			</div>
		</section>
	);
}

export default Project;
