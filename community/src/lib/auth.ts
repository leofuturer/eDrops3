import Cookies from "js-cookie";
import API from "../api/api";
import {
	userCredsTaken,
	userLogin,
	userSignUp,
} from "../api/serverConfig";
import { SignupInfo } from "./types";
import validate from "validate.js";
import { signUpConstraints } from "./formConstraints";

async function login(username: string, password: string): Promise<void> {
	let data = {
		username: username,
		password: password,
	};
	return API.Request(userLogin, "POST", data, false)
		.then((res) => {
			// console.log(res);
			Cookies.set("base_access_token", res.data.token);
			Cookies.set("access_token", res.data.token);
			Cookies.set("userId", res.data.userId);
			Cookies.set("userType", res.data.userType);
			Cookies.set("username", res.data.username);
		})
		.catch((err) => {
			console.error(err);
			if (err.response.status === 401) {
				// this.showErrorMessage();
			}
		});
}

async function signup(user: SignupInfo): Promise<void> {
	return validate
		.async(user, signUpConstraints)
		.then((res) =>
			API.Request(
				userCredsTaken,
				"POST",
				{
					username: res.username,
					email: res.email,
				},
				false
			)
		)
		.then((res) => {
			console.log('verify', res);
			if(res.data.usernameTaken && res.data.emailTaken) {
				throw new Error('Username and email are taken');
			}
			if (res.data.usernameTaken) {
				throw new Error("Username is taken");
			}
			if (res.data.emailTaken) {
				throw new Error("Email is taken");
			}
			return API.Request(
				userSignUp,
				"POST",
				{
					username: user.username,
					email: user.email,
					password: user.password,
				},
				false
			);
		})
		.then((res) => {
			Cookies.set("base_access_token", res.data.token);
			Cookies.set("access_token", res.data.token);
			Cookies.set("userId", res.data.userId);
			Cookies.set("userType", res.data.userType);
			Cookies.set("username", res.data.username);
		})
		.catch((err) => {
			throw err;
		});
}

async function signout(): Promise<void> {
	// let url = "";
	// if (Cookies.get("userType") === "admin") {
	// 	url = AdminLogout;
	// } else if (Cookies.get("userType") === "customer") {
	// 	url = customerLogout;
	// } else if (Cookies.get("userType") === "worker") {
	// 	url = FoundryWorkerLogout;
	// }
	Cookies.remove("userType");
	Cookies.remove("username");
	Cookies.remove("userId");
	Cookies.remove("access_token");
	Cookies.remove("base_access_token");
	// return API.Request(url, "POST", {}, true)
	// 	.then((res) => {
	// 		Cookies.remove("access_token");
	// 		API.Request(userLogout, "POST", {}, true).then((res) => {
	// 			Cookies.remove("base_access_token");
	// 		});
	// 	})
	// 	.catch((err) => {
	// 		console.error(err);
	// 	});
}

export { login, signout, signup };
