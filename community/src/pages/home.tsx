import { useState, useEffect } from "react";
import ProjectCard from "../components/project/ProjectCard";
import ProjectPreview from "../components/project/ProjectPreviewCompact";
import { ForumType, ProjectType } from "../lib/types";
import API from "../api/api";
import { forum, project } from "../api/serverConfig";
import PostCard from "../components/forum/PostCard";

function Home() {
	const featuredProjectIds: number[] = [1, 2, 3];
	const featuredPostIds: number[] = [1, 2, 3];

	const [featuredProjects, setFeaturedProjects] = useState<ProjectType[]>([]);
	const [featuredPosts, setFeaturedPosts] = useState<ForumType[]>([]);

	// useEffect for featured projects
	useEffect(() => {
		Promise.all(
			featuredProjectIds.map((id) =>
				API.Request(
					project.replace("id", id.toString()),
					"GET",
					{},
					false
				)
			)
		).then((res) => {
			setFeaturedProjects(res.map((res) => res.data));
		});
	}, []);

	// useEffect for featured posts
	useEffect(() => {
		Promise.all(
			featuredPostIds.map((id) =>
				API.Request(
					forum.replace("id", id.toString()),
					"GET",
					{},
					false
				)
			)
		).then((res) => {
			setFeaturedPosts(res.map((res) => res.data));
		});
	}, []);

	return (
		<section
			id="hero"
			className="h-full w-full flex flex-row items-center justify-center bg-slate-200 p-10 space-x-10"
		>
			<div className="h-full w-1/2 p-4 bg-white shadow-2x rounded-lg flex flex-col">
				<h1 className="my-4 w-full text-4xl font-semibold text-center">
					Featured <b className="font-extrabold text-sky-700">Projects</b>
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 h-full">
					{featuredProjects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			</div>
			<div className="h-full w-1/2 p-4 bg-white shadow-2xl rounded-lg flex flex-col">
				<h1 className="my-4 w-full text-4xl font-semibold text-center">
					Featured <b className="font-extrabold text-sky-700">Posts</b>
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 h-full ">
					{featuredPosts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
			</div>
		</section>
	);
}

export default Home;
