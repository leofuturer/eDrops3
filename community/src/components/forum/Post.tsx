import { BookmarkIcon, ChevronLeftIcon } from "@heroicons/react/outline";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import API from "../../api/api";
import { post, userSavedPosts } from "../../api/serverConfig";
import { timeAgo } from "../../lib/time";
import { PostType } from "../../lib/types";

function Post() {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);

	const [currentPost, setCurrentPost] = useState<PostType>({} as PostType);
	const [saved, setSaved] = useState(false);

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
			API.Request(
				`${userSavedPosts.replace(
					"id",
					Cookies.get("userId") as string
				)}/${currentPost.id}`,
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
	}, [currentPost]);

	function handleSave() {
		API.Request(
			`${userSavedPosts.replace("id", Cookies.get('userId') as string)}/${
				currentPost.id
			}`,
			"GET",
			{},
			true
		)
			.then((res) => {
				if (res.data) {
					API.Request(
						`${userSavedPosts.replace("id", Cookies.get('userId') as string)}/${
							currentPost.id
						}`,
						"DELETE",
						{},
						true
					).then((res) => {
						setSaved(false);
					});
				} else {
					API.Request(
						`${userSavedPosts.replace("id", Cookies.get('userId') as string)}/${
							currentPost.id
						}`,
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
					</>
				)}
			</div>
		</section>
	);
}

export default Post;
