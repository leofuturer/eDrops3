import FormInput from '@/components/ui/FormInput';
import { api } from '@edroplets/api';
import { LoginSchema } from '@edroplets/schemas';
import {
  Form, Formik
} from 'formik';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cookie, setCookie] = useCookies(['access_token', 'userId', 'userType', 'username']);

  const [initialValues, setInitialValues] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const handleLogin = ({ usernameOrEmail, password }: { usernameOrEmail: string, password: string }) => api.user.login(usernameOrEmail, password).then((data) => {
    setCookie('access_token', data.token, { path: '/' });
    setCookie('userId', data.userId, { path: '/' });
    setCookie('userType', data.userType, { path: '/' });
    setCookie('username', data.username, { path: '/' });
    navigate(location.state?.path || '/home');
  });

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="flex flex-col items-center outline outline-1 outline-gray-300 shadow-xl rounded-md pt-4 pb-10 w-2/3 bg-white">
        <div className="max-w-xs">
          <img src="/img/edroplets-banner.png" alt="eDroplets Logo" className="" />
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={(values, actions) => {
					  handleLogin(values).catch((err) => {
					    actions.setErrors({
					      usernameOrEmail: 'Invalid username or password',
					      password: 'Invalid username or password',
					    });
					  });
          }}
        >
          <Form className="flex flex-col items-center justify-center space-y-4 w-2/3">
            <FormInput name="usernameOrEmail" type="text" displayName="Username or Email" />
            <FormInput name="password" type="password" displayName="Password" />
            <button type="submit" className="w-full h-16 bg-primary text-white text-lg rounded-md mt-8">
              Login
            </button>
          </Form>
        </Formik>
        <div className="w-2/3">
          <p className="text-gray-500 text-sm align-middle text-center w-full before:w-1/5 before:absolute before:border-gray-400 before:border-b-[1px] before:translate-x-[-105%] before:translate-y-2.5 after:w-1/5 after:absolute after:border-gray-400 after:border-b-[1px] after:translate-x-[5%] after:translate-y-2.5 my-2">or</p>
          <button
            type="button"
            className="w-full h-16 bg-white text-primary outline outline-primary outline-1 text-lg rounded-md"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
