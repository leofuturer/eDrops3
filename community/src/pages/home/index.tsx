import PostCard from "@/components/forum/PostCard";
import ProjectCard from "@/components/project/ProjectCard";
import { useEffect, useState } from "react";
import { Post, Project, api } from "@edroplets/api";

export function Home() {
	const [featuredProjectList, setFeaturedProjectList] = useState<Project[]>([]);
	const [featuredPostList, setFeaturedPostList] = useState<Post[]>([]);

	// useEffect for featured projects
	useEffect(() => {
		api.project.getFeatured().then((res) => {
			setFeaturedProjectList(res);
		});
	}, []);

	// useEffect for featured posts
	useEffect(() => {
		api.post.getFeatured().then((res) => {
			setFeaturedPostList(res);
		});
	}, []);

	return (
		<section
			id="hero"
			className="min-h-full w-full grid grid-cols-1 grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-10 items-center justify-center bg-slate-200 p-10 px-10 md:px-20"
		>
			<div className="h-fit min-h-full w-full p-4 bg-white shadow-2xl rounded-lg flex flex-col">
				<h1 className="my-4 w-full text-4xl text-center">
					Featured <b className="text-sky-700">Projects</b>
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-4 h-full grow">
					{featuredProjectList.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			</div>
			<div className="h-fit min-h-full w-full p-4 bg-white shadow-2xl rounded-lg flex flex-col">
				<h1 className="my-4 w-full text-4xl text-center">
					Featured <b className="text-sky-700">Discussions</b>
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-4 h-full grow">
					{featuredPostList.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
			</div>
		</section>
	);
}

export default Home;
