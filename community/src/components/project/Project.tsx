import {
	AnnotationIcon,
	BookmarkIcon,
	ChatAlt2Icon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ThumbUpIcon,
} from "@heroicons/react/outline";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import API from "../../api/api";
import { downloadFile } from "../../api/file";
import { checkReact, react } from "../../api/react";
import { project, projectComments } from "../../api/serverConfig";
import { timeAgo } from "../../lib/time";
import { CommentType, ProjectType } from "../../lib/types";
import ProjectComment from "./ProjectComment";

function Project() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	const [currentProject, setCurrentProject] = useState<ProjectType>(
		{} as ProjectType
	);
	const [saved, setSaved] = useState<boolean>(false);
	const [liked, setLiked] = useState<boolean>(false);
	const [expanded, setExpanded] = useState<boolean>(false);

	const [newComment, setNewComment] = useState<string>("");
	const [comments, setComments] = useState<CommentType[]>([]);

	// Fetch current project and set loading to false after fetch
	useEffect(() => {
		API.Request(project.replace("id", id as string), "GET", {}, false).then(
			(res) => {
				// console.log(res);
				setCurrentProject(res.data);
				setLoading(false);
			}
		);
	}, [id]);

	// Fetch comments and sort based on time
	useEffect(() => {
		API.Request(
			projectComments.replace("id", id as string),
			"GET",
			{},
			false
		).then((res) => {
			const comments: CommentType[] = res.data;
			const sortedComments = comments.sort((a, b) =>
				a.datetime < b.datetime ? 1 : -1
			);
			setComments(sortedComments);
		});
	}, [id, newComment]);

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

	function handleComment() {
		const newPostComment = {
			content: newComment,
			author: "",
			datetime: new Date(),
			likes: 0,
			userId: Cookies.get("userId") as string,
			top: true,
		};
		API.Request(
			projectComments.replace("id", id ?? ""),
			"POST",
			newPostComment,
			true
		)
			.then((res) => {
				setNewComment("");
				currentProject.comments = currentProject.comments + 1;
			})
			.catch((err: AxiosError) => {
				if (err.response?.status === 401) {
					navigate("/login");
				}
				// console.log(err);
			});
		setExpanded(!expanded);
	}

	function handleDownload(fileId: number) {
		downloadFile(Cookies.get("userId") as string, fileId);
	}

	const projectFiles = currentProject?.projectFiles?.map((projectFile) => {
		return (
			<li key={projectFile.id} className="text-sky-700">
				<p
					className="cursor-pointer"
					onClick={() => handleDownload(projectFile.id as number)}
				>
					{projectFile.fileName}
				</p>
			</li>
		);
	});

	const projectLinks = currentProject?.projectLinks?.map((projectLink) => {
		return (
			<li key={projectLink.id} className="text-sky-700">
				<a href={projectLink.link} target="_blank" rel="noreferrer">
					{projectLink.link}
				</a>
			</li>
		);
	});

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
									className={`w-10 h-10 cursor-pointer ${saved ? "fill-black" : ""
										}`}
									onClick={handleSave}
								/>
							</div>
							<p className="text-md">
								<Link to={`/profile/${currentProject?.userId}`}>
									{currentProject?.author}
								</Link>{" "}
								&#8226;{" "}
								{timeAgo(new Date(currentProject.datetime))}
							</p>
						</div>
						<div>{currentProject?.content}</div>
						{projectFiles?.length > 0 && (
							<div>
								<h3 className="underline underline-offset-4 text-xl mb-2">
									Files
								</h3>
								<ul className="flex flex-col space-y-2">
									{projectFiles}
								</ul>
							</div>)}
						{projectLinks?.length > 0 && (
							<div>
								<h3 className="underline underline-offset-4 text-xl mb-2">
									Links
								</h3>
								<ul className="flex flex-col space-y-2">
									{projectLinks}
								</ul>
							</div>)}
						<div className="flex flex-row space-x-4">
							<div
								className="flex flex-row space-x-2 cursor-pointer"
								onClick={handleLike}
							>
								<ThumbUpIcon
									className={`w-6 h-6 cursor-pointer ${liked ? "fill-black" : ""
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
							<div
								className="flex flex-row space-x-2 cursor-pointer"
								onClick={() => setExpanded(!expanded)}
							>
								<AnnotationIcon className="w-6 h-6" />
								<p className="text-md">Comment</p>
							</div>
						</div>
						<div className="flex flex-row space-x-2 border-b-2 border-black pb-2">
							<h3 className="text-xl">Comments</h3>
							<ChatAlt2Icon className="w-6 h-6" />
							<p className="text-md">
								{currentProject?.comments}
							</p>
						</div>
						{expanded && (
							<div
								className={`bg-white p-2 pl-4 flex flex-col space-y-2 ${expanded ? "transition-all" : ""
									} ease-in-out duration-500`}
							>
								<textarea
									title="reply"
									className="w-full rounded-md resize-none border-black/25 border-2 p-2"
									value={newComment}
									onChange={(e) => {
										setNewComment(e.target.value);
									}}
									placeholder="Reply"
								/>
								<div className="flex flex-row justify-end">
									<button
										type="button"
										title="Send"
										className="bg-sky-800 rounded-md p-2"
										onClick={handleComment}
									>
										<ChevronRightIcon className="w-4 h-4 text-white" />
									</button>
								</div>
							</div>
						)}
						<div className="flex flex-col space-y-2">
							{comments.map((comment: CommentType) => (
								<ProjectComment comment={comment} key={comment.id} />
							))}
						</div>
					</>
				)}
			</div>
		</section>
	);
}

export default Project;
