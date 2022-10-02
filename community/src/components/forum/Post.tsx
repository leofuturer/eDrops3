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
import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import API from "../../api/api";
import { checkReact, react } from "../../api/react";
import { post, postComments } from "../../api/serverConfig";
import { timeAgo } from "../../lib/time";
import { CommentType, PostType } from "../../lib/types";
import PostComment from "./PostComment";

function Post() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	const [currentPost, setCurrentPost] = useState<PostType>({} as PostType);
	const [saved, setSaved] = useState<boolean>(false);
	const [liked, setLiked] = useState<boolean>(false);
	const [expanded, setExpanded] = useState<boolean>(false);

	const [newComment, setNewComment] = useState<string>("");
	const [comments, setComments] = useState<CommentType[]>([]);

	// Fetch current post and set loading to false after fetch
	useEffect(() => {
		API.Request(post.replace("id", id as string), "GET", {}, false).then(
			(res) => {
				setCurrentPost(res.data);
				setLoading(false);
			}
		);
	}, [id]);

	// Fetch comments and sort based on time
	useEffect(() => {
		API.Request(
			postComments.replace("id", id as string),
			"GET",
			{},
			false
		).then((res) => {
			// console.log("Top-level comments", res.data);
			const comments: CommentType[] = res.data;
			const sortedComments = comments.sort((a, b) =>
				a.datetime < b.datetime ? 1 : -1
			);
			setComments(sortedComments);
		});
	}, [id, newComment]);

	// Check if post is saved initially
	useEffect(() => {
		if (currentPost.id) {
			checkReact(
				"Post",
				"Save",
				Cookies.get("userId") as string,
				currentPost.id
			).then((res: boolean) => {
				setSaved(res);
			});
		}
	}, [currentPost]);

	// Check if post is liked initially
	useEffect(() => {
		if (currentPost.id) {
			checkReact(
				"Post",
				"Like",
				Cookies.get("userId") as string,
				currentPost.id
			).then((res: boolean) => {
				setLiked(res);
			});
		}
	}, [currentPost]);

	function handleSave() {
		react(
			"Post",
			"Save",
			Cookies.get("userId") as string,
			currentPost.id as number
		)
			.then((res: boolean) => setSaved(res))
			.catch((err: AxiosError) => {
				if (err.response?.status === 401) {
					navigate("/login");
				}
				// console.log(err);
			});
	}

	function handleLike() {
		react(
			"Post",
			"Like",
			Cookies.get("userId") as string,
			currentPost.id as number
		)
			.then((res: boolean) => {
				setLiked(res);
				currentPost.likes = res
					? currentPost.likes + 1
					: currentPost.likes - 1;
			})
			.catch((err: AxiosError) => {
				if (err.response?.status === 401) {
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
			postComments.replace("id", id ?? ""),
			"POST",
			newPostComment,
			true
		)
			.then((res) => {
				setNewComment("");
				currentPost.comments = currentPost.comments + 1;
			})
			.catch((err: AxiosError) => {
				if (err.response?.status === 401) {
					navigate("/login");
				}
				// console.log(err);
			});
		setExpanded(!expanded);
	}

	return (
		<section className="relative bg-slate-200 min-h-full py-10 grid grid-cols-5">
			<div className="flex flex-col items-center">
				<div className="h-10 w-10">
					<NavLink to="/forum">
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
									{currentPost?.title}
								</h1>
								<BookmarkIcon
									className={`w-10 h-10 cursor-pointer ${
										saved ? "fill-black" : ""
									}`}
									onClick={handleSave}
								/>
							</div>
							<p className="text-md">
								<Link to={`/profile/${currentPost?.userId}`}>
									{currentPost?.author}
								</Link>{" "}
								&#8226;{" "}
								{timeAgo(new Date(currentPost.datetime))}
							</p>
						</div>
						<div>{currentPost?.content}</div>
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
								<p className="text-md">{currentPost?.likes}</p>
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
							<p className="text-md">{currentPost?.comments}</p>
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
										onClick={handleComment}
									>
										<ChevronRightIcon className="w-4 h-4 text-white" />
									</button>
								</div>
							</div>
						)}
						<div className="flex flex-col space-y-2">
							{comments.map((comment: CommentType) => (
								<PostComment
									comment={comment}
									key={comment.id}
								/>
							))}
						</div>
					</>
				)}
			</div>
		</section>
	);
}

export default Post;
