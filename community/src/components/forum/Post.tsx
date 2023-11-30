import {
	ChatBubbleBottomCenterTextIcon,
	BookmarkIcon,
	ChatBubbleLeftRightIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { api, request, Post as PostType, PostComment as CommentType } from "@edroplets/api";
import { timeAgo } from "../../lib/time";
import PostComment from "./PostComment";
import { useCookies } from "react-cookie";

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

	const [cookies] = useCookies(["userId"]);

	// Fetch current post and set loading to false after fetch
	useEffect(() => {
		if (!id) {
			navigate("/forum")
			return;
		}
		api.post.get(id).then(
			(res) => {
				setCurrentPost(res);
				setLoading(false);
			}
		);
	}, [id]);

	// Fetch comments and sort based on time
	useEffect(() => {
		if (!id) {
			navigate("/forum")
			return;
		}
		api.post.getPostComments(parseInt(id)).then((res) => {
			// console.log("Top-level comments", res.data);
			const comments: CommentType[] = res;
			const sortedComments = comments.sort((a, b) =>
				a.datetime < b.datetime ? 1 : -1
			);
			setComments(sortedComments);
		});
	}, [id, newComment]);

	// Check if post is saved initially
	useEffect(() => {
		if (currentPost.id && cookies.userId) {
			api.user.getSavedPost(cookies.userId, currentPost.id).then((res) => {
				setSaved(!!res);
			});
		}
	}, [currentPost, cookies.userId]);

	// Check if post is liked initially
	useEffect(() => {
		if (currentPost.id && cookies.userId) {
			api.user.getLikedPost(cookies.userId, currentPost.id).then((res) => {
				setLiked(!!res);
			});
		}
	}, [currentPost, cookies.userId]);

	function handleSave() {
		api.user.savePost(cookies.userId, currentPost.id as number)
			.then((res) => setSaved(res))
			.catch((err: AxiosError) => {
				if (err.response?.status === 401) {
					navigate("/login");
				}
				// console.log(err);
			});
	}

	function handleLike() {
		if (!cookies.userId || !currentPost.id) return;
		api.user.likePost(cookies.userId, currentPost.id as number)
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
		if(!currentPost.id || !cookies.userId) return;
		const newPostComment = {
			content: newComment,
			author: "",
			datetime: new Date(),
			likes: 0,
			userId: cookies.userId,
			top: true,
		};
		api.post.addPostComment(currentPost.id, newPostComment)
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
									className={`w-10 h-10 cursor-pointer ${saved ? "fill-black" : ""
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
								<HandThumbUpIcon
									className={`w-6 h-6 cursor-pointer ${liked ? "fill-black" : ""
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
								<ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
								<p className="text-md">Comment</p>
							</div>
						</div>
						<div className="flex flex-row space-x-2 border-b-2 border-black pb-2">
							<h3 className="text-xl">Comments</h3>
							<ChatBubbleLeftRightIcon className="w-6 h-6" />
							<p className="text-md">{currentPost?.comments}</p>
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
