export enum ROUTES {
  // Public routes
  Root = '/',
  Home = '/home',
  Login = '/login',
  Signup = '/signup',
  ForgotPassword = '/forgot-password',
  ResetPassword = '/reset-password',
  CheckEmail = '/check-email',
  EmailVerified = '/email-verified',
  EmailUnverified = '/email-unverified',
  Project = '/project/:id',
  Projects = '/projects',
  Posts = '/forum',
  Post = '/forum/:id',
  Profile = '/profile/:id',
  SelfProfile = '/profile',
  // Authenticated routes
  NewProject = '/projects/new',
  NewPost = '/forum/new',
}

export const idRoute = (route: ROUTES, id: string | number) => route.replace(':id', id as string);
