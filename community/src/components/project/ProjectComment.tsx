import { useEffect, useState } from "react";
import {
	projectCommentComments,
	projectComments,
} from "@edroplets/api/serverConfig";
import { api } from "@edroplets/api";
import { CommentType, ProjectType } from "../../lib/types";
import { AxiosError } from "axios";
import { ChevronRightIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { timeAgo } from "../../lib/time";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { request } from "@edroplets/api/lib/api";

function ProjectComment({comment} : {comment: CommentType}) {
	const navigate = useNavigate();

	const [comments, setComments] = useState<CommentType[]>([]);
	const [expanded, setExpanded] = useState<boolean>(false);

	const [newComment, setNewComment] = useState<string>("");

	// Get all comments under this comment
	useEffect(() => {
		request(
			projectCommentComments.replace(
				"id",
				comment.id ? comment.id.toString() : ""
			),
			"GET",
			{},
		)
			.then((res) => {
				// console.log(res);
				setComments(res.data);
			})
			.catch((err: AxiosError) => {
				// console.log(err);
			});
	}, [comment.id, newComment]);

	function handleReply() {
		const newProjectComment = {
			content: newComment,
			author: "",
			datetime: new Date(),
			likes: 0,
			projectId: 0,
			userId: Cookies.get("userId") as string,
			top: false,
		};
		request(
			projectCommentComments.replace(
				"id",
				comment.id ? comment.id.toString() : ""
			),
			"POST",
			newProjectComment,
		)
			.then((res) => {
				setNewComment("");
			})
			.catch((err: AxiosError) => {
				if (err.message === "No access token found") {
					navigate("/login");
				}
			});
		setExpanded(!expanded);
	}

	return (
		<div
			className={`flex flex-col space-y-2 ${
				comment.top ? "" : "pl-2 border-l-2 border-black/25"
			}`}
		>
			<div className="flex flex-col space-y-2 pb-2 border-b-2 border-black/25">
				<h3 className="text-lg">
					<Link to={`/profile/${comment?.userId}`}>
						{comment?.author}
					</Link>{" "}
					&#8226; {timeAgo(new Date(comment.datetime))}
				</h3>
				<p>{comment.content}</p>
				<div className="flex flex-row space-x-4">
					<div className="flex flex-row space-x-2">
						<HandThumbUpIcon className="w-5 h-5" />
						<p>{comment.likes}</p>
					</div>
					<div className="flex flex-row space-x-2">
						<ArrowUturnLeftIcon className="w-5 h-5" />
						<button
							type="button"
							onClick={() => setExpanded(!expanded)}
						>
							Reply
						</button>
					</div>
				</div>
			</div>
			{expanded && (
				<div
					className={`bg-white p-2 pl-4 flex flex-col space-y-2 ${
						expanded ? "transition-all" : ""
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
							onClick={handleReply}
						>
							<ChevronRightIcon className="w-4 h-4 text-white" />
						</button>
					</div>
				</div>
			)}
			<div className="">
				{comments.map((comment: CommentType) => (
					<ProjectComment
						comment={comment}
						key={comment.id}
					/>
				))}
			</div>
		</div>
	);
}

export default ProjectComment;
