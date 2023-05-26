import axios, {
	AxiosRequestConfig,
	AxiosRequestHeaders
} from "axios";
import Cookies from "js-cookie";

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function request<T>(url: string, method: HTTPMethod, data: object, headers: Partial<AxiosRequestHeaders> = { "Content-Type": "application/json; charset=utf-8" }) {
	headers.Authorization = `Bearer ${Cookies.get("access_token") ?? ""}`;
	const options: AxiosRequestConfig = {
		method,
		headers,
		url: '/api' + url,
	};
	switch (method) {
		case "GET":
		case "DELETE":
			options.params = data;
			break;
		case "PUT":
		case "POST":
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