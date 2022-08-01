import {
	AnnotationIcon,
	BookmarkIcon,
	ChatAlt2Icon,
	ChevronLeftIcon,
	ThumbUpIcon
} from "@heroicons/react/outline";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import API from "../../api/api";
import { checkReact, react } from "../../api/react";
import {
	post
} from "../../api/serverConfig";
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

	const [comments, setComments] = useState<CommentType[]>([]);

	useEffect(() => {
		API.Request(post.replace("id", id as string), "GET", {}, false).then(
			(res) => {
				setCurrentPost(res.data);
				setLoading(false);
			}
		);
	}, [id]);

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
				if (err.message === "No access token found") {
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
			.then((res: boolean) => setLiked(res))
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
								{currentPost?.author} &#8226;{" "}
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
						<div className="flex flex-col space-y-2">
							{comments.map((comment: CommentType) => (
								<PostComment {...comment} key={comment.id} />
							))}
						</div>
					</>
				)}
			</div>
		</section>
	);
}

export default Post;
