import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import Layout from "./components/Layout";
import Index from "./pages/home";
import Projects from "./pages/projects";
import Forum from "./pages/forum";
import Post from "./components/forum/Post";
import Login from "./pages/login";
import Project from "./components/project/Project";
import Profile from "./pages/profile";
import NewProject from "./pages/projects/new";
import Signup from "./pages/signup";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RecoilRoot>
			<Router>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Index />} />
						<Route path="home" element={<Index />} />
						<Route path="projects" element={<Projects />} />
						<Route path="projects/new" element={<NewProject />} />
						<Route path="project/:id" element={<Project />} />
						<Route path="profile" element={<Profile />} />
						<Route path="profile/:id" element={<Profile />} />
						<Route path="forum" element={<Forum />} />
						<Route path="forum/:id" element={<Post />} />
						<Route path="login" element={<Login />} />
						<Route path="signup" element={<Signup />} />
					</Route>
				</Routes>
			</Router>
		</RecoilRoot>
	</React.StrictMode>
);
