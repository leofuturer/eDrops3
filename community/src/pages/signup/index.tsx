import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@edroplets/api";
// import { SignupInfo } from "../lib/types";
import { Address, Customer, DTO, User } from "@edroplets/api";
import { Formik, Form, Field, FieldProps } from "formik";
import { UserSchema, UserSubmitSchema } from "@edroplets/schemas";
import { ValidationError } from "yup";
import { FormInput } from "@/components/ui/FormInput";

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
			<div className="flex flex-col items-center border-2 shadow-xl rounded-md pt-4 pb-10 w-2/3">
				<div className="max-w-xs">
					<img src="/static/img/edroplets-banner.png" alt="eDroplets Logo" className="" />
				</div>
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
					<Form className="flex flex-col items-center justify-center space-y-4 w-2/3" >
						<FormInput name="email" displayName="Email" autoComplete="email" />
						<FormInput name="username" displayName="Username" autoComplete="username" />
						<FormInput name="password" displayName="Password" type="password" autoComplete="new-password" />
						<FormInput name="confirmPassword" displayName="Confirm Password" type="password" autoComplete="new-password" />
						<button type="submit" className="w-full h-16 bg-primary text-white text-lg rounded-md mt-8">Sign Up</button>
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
