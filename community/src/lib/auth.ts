import {
	AdminLogin,
	customerLogin,
	FoundryWorkerLogin,
	userLogin,
	customerLogout,
	AdminLogout,
	FoundryWorkerLogout,
	userLogout,
	userSignUp,
} from "../api/serverConfig";
import API from "../api/api";
import Cookies from "js-cookie";

async function login(username: string, password: string): Promise<void> {
	let data = {
		username: username,
		password: password,
	};
	return API.Request(userLogin, "POST", data, false)
		.then((res) => {
			console.log(res);
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

async function signup(username: string, password: string): Promise<void> {
	let data = {
		username: username,
		password: password,
	};
	return API.Request(userSignUp, "POST", data, false)
		.then((res) => {
			Cookies.set("base_access_token", res.data.id);
			Cookies.set("access_token", res.data.id);
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
