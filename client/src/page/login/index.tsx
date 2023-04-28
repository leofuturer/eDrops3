import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Field, Formik, Form, FieldProps } from 'formik';
import { request } from '../../api';
import {
  userLogin
} from '../../api';
import SEO from '../../component/header/seo';
import { metadata } from './metadata';
import { LoginSchema } from '../../schemas';

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [cookies, setCookie] = useCookies(['userId', 'userType', 'username', 'base_access_token', 'access_token']);

  function handleLogin({ usernameOrEmail, password }: { usernameOrEmail: string, password: string }) {
    const data = (/@/.test(usernameOrEmail)) ? {
      email: usernameOrEmail,
      password: password,
    } : {
      username: usernameOrEmail,
      password: password,
    };
    request(userLogin, 'POST', data, false)
      .then((res) => {
        // console.log(res);
        // setCookie('base_access_token', res.data.token);
        setCookie('access_token', res.data.token, { path: '/' });
        setCookie('userId', res.data.userId, { path: '/' });
        setCookie('userType', res.data.userType, { path: '/' });
        setCookie('username', res.data.username, { path: '/' });
        navigate(location.state?.path || '/home');
        setError(false);
      }).catch((err) => {
        // console.error(err);
        if (err.response.status === 401) {
          setError(true);
        }
      });
  }

  return (
    <div className="flex items-center justify-center py-20">
      <SEO
        title="eDroplets | Login"
        description=""
        metadata={metadata}
      />
      <div className="flex flex-col shadow-box-sm rounded-lg py-4 px-20 space-y-2">
        <h3 className="text-secondary text-2xl text-center font-bold border-b-2 pb-2 border-secondary">Login</h3>
        <p className="text-sm text-center">Don't have an account? <NavLink to="/signup" className="text-primary_light hover:text-primary">Register now</NavLink></p>
        <Formik
          initialValues={{
            usernameOrEmail: '',
            password: '',
          }}
          validationSchema={LoginSchema}
          onSubmit={(values) => handleLogin(values)}
        >
          <Form className="flex flex-col space-y-2">
            <Field
              name="usernameOrEmail"
            >
              {({
                field,
                meta,
              }: FieldProps) => (
                <input
                  type="text"
                  className={`w-full outline outline-1 outline-gray-400 rounded shadow-inner focus:shadow-box-sm px-2 py-1 ${meta.touched && meta.error ? 'outline-red-700 focus:shadow-red-700' : 'outline-gray-400 focus:shadow-primary_light focus:outline-primary_light'}`}
                  placeholder="Username or Email"
                  autoComplete="username"
                  {...field}
                />
              )}
            </Field>
            <Field name="password" >
              {({
                field,
                meta,
              }: FieldProps) => (
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full outline outline-1 outline-gray-400 rounded shadow-inner focus:shadow-box-sm px-2 py-1 ${meta.touched && meta.error ? 'outline-red-700 focus:shadow-red-700' : 'outline-gray-400 focus:shadow-primary_light focus:outline-primary_light'}`}
                    placeholder="Password"
                    autoComplete="current-password"
                    {...field}
                  />
                  <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} absolute right-2 cursor-pointer text-gray-600`} onClick={() => setShowPassword(!showPassword)} />
                </div>
              )}
            </Field>
            <button type="submit" className="bg-secondary text-white rounded-lg px-4 py-2 w-full">Login</button>
          </Form>
        </Formik>
        <p className="text-red-600 text-center">{error && "Login error. Please check login credentials and ensure email is verified."}</p>
        <NavLink to="/forgetPass" className="text-center text-primary_light hover:text-primary text-sm">Forgot Password?</NavLink>
        <p className="text-center text-sm">If you experience trouble logging in to your account, please <a href="mailto:info@edroplets.org">contact us.</a></p>
      </div>
    </div >
  );
}