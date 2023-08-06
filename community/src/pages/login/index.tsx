import React, { useState } from "react";
import { api } from "@edroplets/api";
import { LoginSchema, UserSubmitSchema } from "@edroplets/schemas";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useCookies } from "react-cookie";

export function Login() {
	const navigate = useNavigate();
	const location = useLocation();

	const [cookie, setCookie] = useCookies(['access_token', 'userId', 'userType', 'username']);

	const [initialValues, setInitialValues] = useState({
		usernameOrEmail: "",
		password: "",
	});

	return (
		<div className="w-full h-full flex flex-col justify-center items-center">
			<div className="flex flex-col items-center border-2 shadow-xl rounded-md p-4 w-1/2 h-1/2 justify-evenly">
				<h1 className="text-lg">Login</h1>
				<Formik
					initialValues={initialValues}
					validationSchema={LoginSchema}
					onSubmit={(values, actions) => {
						api.user.login(values.usernameOrEmail, values.password).then((data) => {
							setCookie('access_token', data.token, { path: '/' });
							setCookie('userId', data.userId, { path: '/' });
							setCookie('userType', data.userType, { path: '/' });
							setCookie('username', data.username, { path: '/' });
							navigate(location.state?.path || "/home");
						});
					}}
				>
					<Form
						className="flex flex-col items-center justify-center space-y-4"
					>
						<Field type="text" name="usernameOrEmail" />
						<Field type="password" name="password" />
						<ErrorMessage name="username" />
						<ErrorMessage name="password" />
						<button type="submit" className="w-full h-8 border-2 rounded-md mt-8">
							Login
						</button>
						{/* <div className="w-full">
							<label htmlFor="user" className="text-sm">
								Username or Email
							</label>
							<input
								id="user"
								type="text"
								className="w-full h-8 p-2 border-2 rounded-md"
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						<div className="w-full">
							<label htmlFor="password" className="text-sm">
								Password
							</label>
							<input
								id="password"
								type="password"
								className="w-full h-8 p-2 border-2 rounded-md"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div> */}
					</Form>
				</Formik>
			</div>
		</div >
	);
}

export default Login;
