import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import {
  Home, Projects, NewProject, Project, Profile, Forum, NewForum, Post, Login, Signup, CheckEmail, EmailVerified, EmailUnverified,
} from '@/pages/index';
import Layout from './components/Layout';
import { AuthLayout } from './components/AuthLayout';
import { ROUTES } from './router/routes';

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path={ROUTES.Root} element={<Layout />}>
					<Route index element={<Home />} />
					<Route path={ROUTES.Home} element={<Home />} />
					<Route path={ROUTES.Projects} element={<Projects />} />
					<Route path={ROUTES.Project} element={<Project />} />
					<Route path={ROUTES.Profile} element={<Profile />} />
					<Route path={ROUTES.Posts} element={<Forum />} />
					<Route path={ROUTES.Post} element={<Post />} />
					<Route path={ROUTES.Login} element={<Login />} />
					<Route path={ROUTES.Signup} element={<Signup />} />
					<Route path={ROUTES.ForgotPassword} element={<ForgotPassword />} />
					<Route path={ROUTES.ResetPassword} element={<ResetPassword />} />
					<Route path={ROUTES.CheckEmail} element={<CheckEmail />} />
					<Route path={ROUTES.EmailVerified} element={<EmailVerified />} />
					<Route path={ROUTES.EmailUnverified} element={<EmailUnverified />} />
					<Route element={<AuthLayout />} >
						<Route path={ROUTES.SelfProfile} element={<Profile />} />
						<Route path={ROUTES.NewProject} element={<NewProject />} />
						<Route path={ROUTES.NewPost} element={<NewForum />} />
					</Route>
				</Route>
			</Routes>
		</Router>
	</React.StrictMode>
);
