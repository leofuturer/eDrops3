import axios, {
	AxiosError,
	AxiosRequestConfig,
	AxiosRequestHeaders,
	AxiosResponse,
} from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useCookies } from "react-cookie";

interface APIOptions {
	url: string;
	method: string;
	data: object;
	auth: boolean;
	headers: Partial<AxiosRequestHeaders>;
}

export function useAPI({ url, method, data, auth, headers = {
	"Content-Type": "application/json; charset=utf-8",
} }: APIOptions): AxiosResponse {
	const [cookies] = useCookies(["access_token"]);
	if (auth) {
		if (!cookies.access_token) {
			throw new AxiosError("No access token found", undefined, undefined, undefined, {
				status: 401,
				statusText: "Unauthorized",
			} as AxiosResponse);
		} else {
			headers.Authorization = `Bearer ${cookies.access_token}`;
		}
	}
	headers["X-edrop-userbase"] = cookies.access_token ?? "";
	const options: AxiosRequestConfig = {
		url,
		method,
		headers,
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
			throw new AxiosError("Invalid HTTP method", undefined, undefined, undefined, {
				status: 400,
				statusText: "Bad Request",
			} as AxiosResponse);
	}

	const [res, setRes] = useState<AxiosResponse>();

	axios(options).then((res) => {
		setRes(res);
	});

	return res;
}

export async function request(url: string, method: string, data: object, auth: boolean, headers: Partial<AxiosRequestHeaders> = {
	"Content-Type": "application/json; charset=utf-8",
}) {
	if (auth) {
		if (!Cookies.get("access_token")) {
			throw new AxiosError("No access token found", undefined, undefined, undefined, {
				status: 401,
				statusText: "Unauthorized",
			} as AxiosResponse);
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

	const res = await axios(options);
	return res;
}

class API {
	/**
	 * Custom function used to send request to backend APIs
	 * @param {string} url - backend API url
	 * @param {string} method - GET, POST, PATCH, DELETE, etc.
	 * @param {object} data - JSON data to accompany request
	 * @param {boolean} useToken - Use login token or not
	 * @param {object} [headers] - optional, headers to accompany request
	 * @param {boolean} [sendDataRaw] - DEPRECATED, optional, if true, send data without JSON.stringify
	 */
	async Request(
		url: string,
		method: string,
		data: object,
		useToken: boolean,
		headers: Partial<AxiosRequestHeaders> = {
			"Content-Type": "application/json; charset=utf-8",
		},
		sendDataRaw: boolean = true
	) {
		try {
			if (useToken) {
				if (!Cookies.get("access_token")) {
					throw new AxiosError(
						"No access token found",
						undefined,
						undefined,
						undefined,
						{
							status: 401,
							statusText: "Unauthorized",
						} as AxiosResponse
					);
				} else {
					headers.Authorization = `Bearer ${Cookies.get(
						"access_token"
					)}`;
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

			const res = await axios(options);
			return res;
		} catch (error) {
			// console.error(error);
			throw error;
		}
	}
}

export default new API();