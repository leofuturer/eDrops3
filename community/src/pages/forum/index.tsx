import PostPreview from "@/components/forum/PostPreview";
import ProfilePreview from "@/components/profile/ProfilePreview";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { api, Post } from "@edroplets/api";

export function Forum() {
	const [postList, setPostList] = useState<Post[]>([]);
	const [sortedPosts, setSortedPosts] = useState<Post[]>([]);
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
		api.post.getAll({filter}).then((res) => {
			setPostList(res);
		});
	}, [search]);

	useEffect(() => {
		const sortedPosts = ([] as Post[]).concat(postList)
		if (feedType === "Featured") {
			sortedPosts.sort((a, b) => (a.likes < b.likes ? 1 : -1));
		} else if (feedType === "New") {
			sortedPosts.sort((a, b) => (a.datetime < b.datetime ? 1 : -1));
		}
		setSortedPosts(sortedPosts);
	}, [feedType, postList]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		// console.log(e.target.value);
	};

	const debounceSearch = useMemo(() => {
		return debounce(handleSearch, 300);
	}, []);

	useEffect(() => debounceSearch.cancel());

	return (
		<section className="bg-slate-200 min-h-full grid grid-cols-4 gap-5 lg:gap-10 px-10 lg:px-20">
			<ProfilePreview />
			<div className="col-span-4 md:col-span-2 flex flex-col">
				<div className="w-full flex flex-row py-4 h-20 space-x-4">
					<div className="relative w-4/5 h-full">
						<input
							type="text"
							placeholder="Search projects"
							onChange={debounceSearch}
							className="w-full h-full rounded-2xl p-2"
						/>
						<MagnifyingGlassIcon className="absolute top-4 right-4 h-4 w-4 text-slate-400" />
					</div>
					<div className="w-1/5 h-full">
						<NavLink to="/forum/new">
							<button
								type="button"
								className="bg-sky-800 text-white rounded-2xl w-full h-full hidden lg:flex items-center justify-center"
							>
								New Post
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
				<div id="postList">
					{sortedPosts.map((post) => (
						<PostPreview post={post} key={post.id} />
					))}
				</div>
			</div>
			<div className="hidden md:flex flex-col mt-20">
				<div className="flex flex-col sticky top-20 space-y-4">
					<div
						className={`py-2 px-4 justify-center items-center rounded-3xl ${feedType === "Featured"
								? "bg-sky-800 text-white"
								: ""
							}`}
						onClick={() => setFeedType("Featured")}
					>
						<p className="text-2xl text-center">Featured</p>
					</div>
					<div
						className={`py-2 px-4 justify-center items-center rounded-3xl ${feedType === "New" ? "bg-sky-800 text-white" : ""
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

export default Forum;
