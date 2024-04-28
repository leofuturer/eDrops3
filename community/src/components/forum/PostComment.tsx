import { ChevronRightIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@edroplets/api";
import { timeAgo } from "../../lib/time";
import { PostComment as CommentType } from "@edroplets/api";
import { useCookies } from "react-cookie";

function PostComment( commentData : {comment: CommentType }) {
	const navigate = useNavigate();

	const [comments, setComments] = useState<CommentType[]>([]);
	const [expanded, setExpanded] = useState<boolean>(false);

	const [newComment, setNewComment] = useState<string>(""); // eventually debounce this

	const [cookies] = useCookies(["userId"]);
	const [comment, setComment] = useState<CommentType>(commentData.comment);

	// Get all comments under this comment
	useEffect(() => {
		api.postComment.getPostComments(comment.id as number)
			.then((res) => {
				// console.log('Not top-level comments', res.data);
				setComments(res);
			})
			.catch((err: AxiosError) => {
				// console.log(err);
			});
	}, [comment.id, newComment]);

	function handleReply() {
		if(!comment.id || !cookies.userId) return;
		const newPostComment = {
			content: newComment,
			author: "",
			datetime: new Date(),
			likes: 0,
			postId: comment.postId,
			userId: cookies.userId,
			top: false,
		};
		api.postComment.createPostComment(comment.id, newPostComment)
			.then((res) => {
				setNewComment("");
				// @ts-ignore
				currentPost.comments += 1;
			})
			.catch((err: AxiosError) => {
				if (err.message === "No access token found") {
					navigate("/login");
				}
			});
		setExpanded(!expanded);
	}

	function needAuth(f: Function) {
		if (!cookies.userId) {
			navigate("/login");
		} else {
			f();
		}
	}

	function handleOpen() {
		setExpanded(!expanded);
	}

	function handleLike() {
		if(!comment.id || !cookies.userId) return;
		api.postComment.update(comment.id, {userId: cookies.userId})
			.then((res) => {
				// @ts-ignore
				let temp = structuredClone(comment);
				temp.likes++;
				setComment(temp);
				console.log("liked this commment");
				
			})
			.catch((err: AxiosError) => {
				if (err.message === "No access token found") {
					navigate("/login");
				}
			});
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
					<div className="flex flex-row space-x-2 cursor-pointer" onClick={() => needAuth(handleLike)}>
						<HandThumbUpIcon className="w-5 h-5" />
						<p>{comment.likes}</p>
					</div>
					<div className="flex flex-row space-x-2">
						<ArrowUturnLeftIcon className="w-5 h-5" />
						<button
							type="button"
							onClick={() => needAuth(handleOpen)}
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
					<PostComment comment={comment} key={comment.id} />
				))}
			</div>
		</div>
	);
}

export default PostComment;
