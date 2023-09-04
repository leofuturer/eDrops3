import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { Home, Projects, NewProject, Project, Profile, Forum, NewForum, Post, Login, Signup, CheckEmail, EmailVerified, EmailUnverified } from "@/pages/index";
import Layout from "./components/Layout";
import { ROUTES } from "./router/routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path={ROUTES.Root} element={<Layout />}>
					<Route index element={<Home />} />
					<Route path={ROUTES.Home} element={<Home />} />
					<Route path="projects" element={<Projects />} />
					<Route path="projects/new" element={<NewProject />} />
					<Route path="project/:id" element={<Project />} />
					<Route path="profile" element={<Profile />} />
					<Route path="profile/:id" element={<Profile />} />
					<Route path="forum" element={<Forum />} />
					<Route path="forum/new" element={<NewForum />} />
					<Route path="forum/:id" element={<Post />} />
					<Route path={ROUTES.Login} element={<Login />} />
					<Route path={ROUTES.Signup} element={<Signup />} />
					<Route path={ROUTES.CheckEmail} element={<CheckEmail />} />
					<Route path={ROUTES.EmailVerified} element={<EmailVerified />} />
					<Route path={ROUTES.EmailUnverified} element={<EmailUnverified />} />
				</Route>
			</Routes>
		</Router>
	</React.StrictMode>
);
