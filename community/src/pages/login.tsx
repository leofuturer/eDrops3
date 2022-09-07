import React, { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Login() {
	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		login(username, password).then(() => navigate("/home"));
	};

	return (
		<div className="w-full h-full flex flex-col justify-center items-center">
			<div className="flex flex-col items-center border-2 shadow-xl rounded-md p-4 w-1/2 h-1/2 justify-evenly">
				<h1 className="text-lg">Login</h1>
				<form
					className="flex flex-col items-center justify-center space-y-4"
					onSubmit={(e) => handleLogin(e)}
				>
					<div className="w-full">
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
					</div>
					<div className="w-full">
						<button className="w-full h-8 border-2 rounded-md mt-8">
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
