import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { Home, Projects, NewProject, Project, Profile, Forum, NewForum, Post, Login, Signup } from "@/pages/index";
import Layout from "./components/Layout";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="home" element={<Home />} />
					<Route path="projects" element={<Projects />} />
					<Route path="projects/new" element={<NewProject />} />
					<Route path="project/:id" element={<Project />} />
					<Route path="profile" element={<Profile />} />
					<Route path="profile/:id" element={<Profile />} />
					<Route path="forum" element={<Forum />} />
					<Route path="forum/new" element={<NewForum />} />
					<Route path="forum/:id" element={<Post />} />
					<Route path="login" element={<Login />} />
					<Route path="signup" element={<Signup />} />
				</Route>
			</Routes>
		</Router>
	</React.StrictMode>
);
