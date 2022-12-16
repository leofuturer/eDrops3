import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import API from '../../api/api';
import {
  userLogin
} from '../../api/serverConfig';

import SEO from '../../component/header/SEO.js';
import { metadata } from './metadata.jsx';

import { useCookies } from 'react-cookie';
import validate from 'validate.js';

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(false);

  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies(['userId', 'userType', 'username', 'base_access_token', 'access_token']);

  function handleNameEmailValidation(): boolean {
    const constraints = {
      usernameOrEmail: {
        presence: true,
      },
      password: {
        presence: true,
      },
    };
    const errors = validate({
      usernameOrEmail: usernameOrEmail,
      password: password,
    }, constraints) || {};
    setErrors(errors);
    return !errors.usernameOrEmail && !errors.password;
  }

  function enterPressed(e) {
    const code = e.keyCode || e.which;
    if (code === 13) { // the ENTER key
      handleLogin();
    }
  }

  function handleLogin() {
    setIsLoading(true);
    let data;
    if (/@/.test(usernameOrEmail)) {
      data = {
        email: usernameOrEmail,
        password: password,
      };
    } else {
      data = {
        username: usernameOrEmail,
        password: password,
      };
    }
    let url; // URLs for backend requests
    setLoginError(false);
    const nameEmailResult = handleNameEmailValidation();
    if (nameEmailResult) {
      API.Request(userLogin, 'POST', data, false)
        .then((res) => {
          // console.log(res);
          setCookie('base_access_token', res.data.token);
          setCookie('access_token', res.data.token);
          setCookie('userId', res.data.userId);
          setCookie('userType', res.data.userType);
          setCookie('username', res.data.username);
          navigate('/home');
        }).catch((err) => {
          console.error(err);
          if (err.response.status === 401) {
            setLoginError(true);
          }
        }).finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center py-20">
      <SEO
        title="eDrops | Login"
        description=""
        metadata={metadata}
      />
      <div className="flex flex-col shadow-box-sm rounded-lg py-4 px-20 space-y-2">
        <h3 className="text-secondary text-2xl text-center font-bold border-b-2 pb-2 border-secondary">Login</h3>
        <div className="border-h3" />
        <form className="flex flex-col space-y-4">
          <p className="text-sm text-center">Don't have an account? <NavLink to="/register" className="text-primary_light hover:text-primary">Register now</NavLink></p>
          <div className="">
            <input
              type="text"
              name="usernameOrEmail"
              className="w-full outline outline-1 outline-gray-300 rounded shadow-inner focus:outline-primary_light focus:shadow-primary_light focus:shadow-box-sm px-2 py-1"
              placeholder="Username or Email"
              autoComplete="username"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
            <div className="registrationError messages" />
          </div>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="w-full outline outline-1 outline-gray-300 rounded shadow-inner focus:outline-primary_light focus:shadow-primary_light focus:shadow-box-sm px-2 py-1"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => enterPressed(e)}
              onBlur={() => setShowPassword(false)}
            />
            <i className="fa fa-eye absolute right-2 cursor-pointer text-gray-600" onClick={() => setShowPassword(!showPassword)} />
            <div className="passwordError messages" />
          </div>
          <div className="flex justify-center items-center">
            {
              isLoading
                ? <img src="/img/loading80px.gif" alt="" />
                : (
                  <button
                    type="button"
                    className="bg-secondary text-white rounded-lg px-4 py-2 w-full"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                )
            }
          </div>
          <p className="text-red-600 text-center">{loginError && "Login error. Please check login credentials and ensure email is verified."}</p>
          <NavLink to="/forgetPass" className="text-center text-primary_light hover:text-primary text-sm">Forgot Password?</NavLink>
          {/*
                  <div className="form-group">
                    <div className="border-div-goole">
                        <i className="fa fa-google"></i>
                        <span className="span-txt-padding">Login with Google</span>
                    </div>
                    <div className="border-div-goole">
                        <i className="fa fa-facebook"></i>
                        <span className="span-txt-padding">Login with Facebook</span>
                    </div>
                  </div>
                */}
          <p className="text-center text-sm">If you experience trouble logging in to your account, please <a href="mailto:service@edrops.org">contact us.</a></p>
        </form>
      </div>
    </div>
  );
}

export default Login;
