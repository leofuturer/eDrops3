import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { api } from "@edroplets/api";
// import { SignupInfo } from "../lib/types";
import { Address, Customer, DTO, User } from "@edroplets/api/lib/models";
import { Formik } from "formik";
import { UserSchema, UserSubmitSchema } from "@/schemas";
import { ValidationError } from "yup";

export function Signup() {
	const navigate = useNavigate();
	const [errors, setErrors] = useState<string[] | null>(null);

	const [initialInfo, setInitialInfo] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleRegister = (userData: DTO<User>) => {
		api.user.create(userData)
			.then((res) => {
				// console.log(res);
				navigate("/home")
			})
			.catch((err: Error & { [key: string]: string[] }) => {
				if (err.message) {
					setErrors([err.message]);
				}
				else {
					const allErrors = [];
					for (const key in err) {
						allErrors.push(...err[key]);
					}
					setErrors(allErrors);
				}
			});
	};

	return (
		<div className="w-full h-full flex flex-col justify-center items-center">
			<div className="flex flex-col items-center border-2 shadow-xl rounded-md p-4 w-1/2 justify-evenly">
				<h1 className="text-lg">Signup</h1>
				<Formik
					validationSchema={UserSchema}
					initialValues={initialInfo}
					onSubmit={(values, actions) => UserSubmitSchema.validate(values, { abortEarly: false }).then(() => {
						handleRegister({ ...values });
					}).catch(
						(err) => {
							const errors = err.inner.reduce((acc: object, curr: ValidationError) => {
								return {
									...acc,
									[curr.path as string]: curr.message,
								};
							}, {});
							actions.setErrors(errors);
						}
					)}
				>
					<Form className="flex flex-col space-y-2">
					</Form>
				</Formik>
				{/* <form
					className="flex flex-col items-center justify-center space-y-4"
					onSubmit={(e) => handleLogin(e)}
				>
					<div className="w-full">
						<label htmlFor="email" className="text-sm">
							Email
						</label>
						<input
							id="email"
							type="text"
							className="w-full h-8 p-2 border-2 rounded-md"
							value={formData.email}
							onChange={(e) =>
								setFormData({
									...formData,
									email: e.target.value,
								})
							}
						/>
					</div>
					<div className="w-full">
						<label htmlFor="username" className="text-sm">
							Username
						</label>
						<input
							id="username"
							type="text"
							className="w-full h-8 p-2 border-2 rounded-md"
							value={formData.username}
							onChange={(e) =>
								setFormData({
									...formData,
									username: e.target.value,
								})
							}
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
							value={formData.password}
							onChange={(e) =>
								setFormData({
									...formData,
									password: e.target.value,
								})
							}
						/>
					</div>
					<div className="w-full">
						<label htmlFor="confirmPassword" className="text-sm">
							Confirm Password
						</label>
						<input
							id="confirmPassword"
							type="password"
							className="w-full h-8 p-2 border-2 rounded-md"
							value={formData.confirmPassword}
							onChange={(e) =>
								setFormData({
									...formData,
									confirmPassword: e.target.value,
								})
							}
						/>
					</div>
					<div className="w-full flex flex-col justify-center items-center space-y-2">
						<button className="w-full h-8 border-2 rounded-md mt-8">
							Signup
						</button>
						<ul className="list-none text-red-700 text-xs text-center">
							{errors?.map((err, index) => (
								<li key={index}>{err}</li>
							))}
						</ul>
					</div>
				</form> */}
			</div>
		</div>
	);
}

export default Signup;
