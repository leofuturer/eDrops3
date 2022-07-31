import { useState, useEffect } from "react";
import ProjectCard from "../components/project/ProjectCard";
import ProjectPreview from "../components/project/ProjectPreviewCompact";
import { PostType, ProjectType } from "../lib/types";
import API from "../api/api";
import { featuredPosts, featuredProjects } from "../api/serverConfig";
import PostCard from "../components/forum/PostCard";

function Home() {
	const [featuredProjectList, setFeaturedProjectList] = useState<ProjectType[]>([]);
	const [featuredPostList, setFeaturedPostList] = useState<PostType[]>([]);

	// useEffect for featured projects
	useEffect(() => {
		API.Request(featuredProjects, 'GET', {}, false).then((res) => {
			setFeaturedProjectList(res.data);
		});
	}, []);

	// useEffect for featured posts
	useEffect(() => {
		API.Request(featuredPosts, 'GET', {}, false).then((res) => {
			setFeaturedPostList(res.data);
		});
	}, []);

	return (
		<section
			id="hero"
			className="h-full w-full flex flex-row items-center justify-center bg-slate-200 p-10 space-x-10"
		>
			<div className="h-full w-1/2 p-4 bg-white shadow-2xl rounded-lg flex flex-col">
				<h1 className="my-4 w-full text-4xl font-semibold text-center">
					Featured <b className="font-extrabold text-sky-700">Projects</b>
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 h-full">
					{featuredProjectList.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			</div>
			<div className="h-full w-1/2 p-4 bg-white shadow-2xl rounded-lg flex flex-col">
				<h1 className="my-4 w-full text-4xl font-semibold text-center">
					Featured <b className="font-extrabold text-sky-700">Posts</b>
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 h-full">
					{featuredPostList.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
			</div>
		</section>
	);
}

export default Home;
