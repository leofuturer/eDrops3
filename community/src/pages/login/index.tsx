import React, { useState } from "react";
import { api } from "@edroplets/api";
import { LoginSchema, UserSubmitSchema } from "@edroplets/schemas";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, FieldProps, Form, Formik, validateYupSchema } from "formik";
import { useCookies } from "react-cookie";
import FormInput from "@/components/ui/FormInput";
import { ROUTES } from "@/router/routes";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();

	const [cookie, setCookie] = useCookies(['access_token', 'userId', 'userType', 'username']);
	const [showPassword, setShowPassword] = useState(false); //from client

	const [initialValues, setInitialValues] = useState({			//Not in client version
		usernameOrEmail: "",
		password: "",
	});

	const handleLogin = ({ usernameOrEmail, password }: { usernameOrEmail: string, password: string }) => {
		return api.user.login(usernameOrEmail, password).then((data) => {
			setCookie('access_token', data.token, { path: '/' });
			setCookie('userId', data.userId, { path: '/' });
			setCookie('userType', data.userType, { path: '/' });
			setCookie('username', data.username, { path: '/' });
			navigate(location.state?.path || ROUTES.Home);
		});
	};

	return (
		<div className="w-full h-full flex flex-col justify-center items-center">
			<div className="flex flex-col items-center outline outline-1 outline-gray-300 shadow-xl rounded-md pt-4 pb-10 w-1/2 bg-white">
				<div className="max-w-xs" style={{ maxWidth: '30%' }}>
					<img src="/img/edroplets-banner.png" alt="eDroplets Logo" className="" />
				</div>
				<Formik
					initialValues={initialValues}
					validationSchema={LoginSchema}
					onSubmit={(values, actions) => {
						handleLogin(values).catch((err) => {
							actions.setErrors({
								usernameOrEmail: "Invalid username or password",
								password: "Invalid username or password",
							});
						});
					}}
				>
					<Form className="flex flex-col space-y-2">
					<Field name="usernameOrEmail">
						{({field, meta,}: FieldProps) => (
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
						{({ field, meta,}: FieldProps) => (
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
						<button type="submit" className="w-full h-16 bg-primary text-white text-lg rounded-md mt-8">
							Login
						</button>
						<p className="text-gray-500 text-sm text-center relative my-2">
							<span className="absolute left-0 right-0 top-1/2 bg-gray-400 h-px transform -translate-y-1/2"></span>
							<span className="relative z-10 px-2 bg-white">or</span>
						</p>
						<button type="button" className="w-full h-16 bg-white text-primary outline outline-primary outline-1 text-lg rounded-md"
							onClick={() => navigate("/signup")}>
							Sign up
						</button>
					</Form>
				</Formik>
				
				<NavLink to={ROUTES.ForgotPassword} className="text-center text-primary_light hover:text-primary text-sm mt-4">Forgot Password?</NavLink>
				<p className="text-center text-sm mt-2">If you experience trouble logging in to your account, please <a href="mailto:info@edroplets.org">contact us.</a></p>
				<div className="w-2/3">
					
					
				</div>
			</div>
		</div >
	);
}

export default Login;
