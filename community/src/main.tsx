import {
  CheckEmail,
  EmailUnverified,
  EmailVerified,
  Forum,
  Home,
  Login,
  NewForum,
  NewProject,
  Post,
  Profile,
  Project,
  Projects,
  Signup,
} from '@/pages/index';
import ReactDOM from 'react-dom/client';
import {
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';
import { AuthLayout } from './components/AuthLayout';
import Layout from './components/Layout';
import './index.css';
import { ROUTES } from './router/routes';

ReactDOM.createRoot(document.getElementById('root')!).render(
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
          <Route path={ROUTES.CheckEmail} element={<CheckEmail />} />
          <Route path={ROUTES.EmailVerified} element={<EmailVerified />} />
          <Route path={ROUTES.EmailUnverified} element={<EmailUnverified />} />
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.SelfProfile} element={<Profile />} />
            <Route path={ROUTES.NewProject} element={<NewProject />} />
            <Route path={ROUTES.NewPost} element={<NewForum />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>,
);
