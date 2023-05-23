import axios, {
	AxiosRequestConfig,
	AxiosRequestHeaders
} from "axios";
import Cookies from "js-cookie";

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function request<T>(url: string, method: HTTPMethod, data: object, auth: boolean, headers: Partial<AxiosRequestHeaders> = {
	"Content-Type": "application/json; charset=utf-8",
}) {
	if (auth) {
		if (!Cookies.get("access_token")) {
			throw new Error("No access token found");
			// throw new AxiosError("No access token found", undefined, undefined, undefined, {
			// 	status: 401,
			// 	statusText: "Unauthorized",
			// } as AxiosResponse);
		} else {
			headers.Authorization = `Bearer ${Cookies.get("access_token")}`;
		}
	}
	headers["X-edrop-userbase"] = Cookies.get("access_token") ?? "";
	const options: AxiosRequestConfig = {
		method,
		headers,
		url,
	};
	switch (method) {
		case "GET":
			options.params = data;
			break;
		case "PUT":
		case "POST":
		case "DELETE":
		case "PATCH":
			options.data = data;
			break;
		default:
			throw new Error("Invalid method");
	}

	const res = await axios<T>(options);
	return res;
}

export default request;