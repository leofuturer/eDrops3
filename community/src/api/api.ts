import axios, {
	AxiosError,
	AxiosRequestConfig,
	AxiosRequestHeaders,
	AxiosResponse,
} from "axios";
import Cookies from "js-cookie";

class API {
	/**
	 * Custom function used to send request to backend APIs
	 * @param {string} url - backend API url
	 * @param {string} method - GET, POST, PATCH, DELETE, etc.
	 * @param {object} data - JSON data to accompany request
	 * @param {boolean} useToken - Use login token or not
	 * @param {object} [headers] - optional, headers to accompany request
	 * @param {boolean} sendDataRaw - optional, if true, send data without JSON.stringify
	 */
	async Request(
		url: string,
		method: string,
		data: object,
		useToken: boolean,
		headers: AxiosRequestHeaders = {
			"content-type": "application/json; charset=utf-8",
		},
		sendDataRaw: boolean = false
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
			const dataToSend = sendDataRaw ? data : JSON.stringify(data);
			const options: AxiosRequestConfig = {
				method,
				headers,
				url,
			};
			switch (method) {
				case "GET":
					options.params = dataToSend;
					break;
				case "POST":
				case "PUT":
				case "PATCH":
					options.data = dataToSend;
					break;
				case "DELETE":
					// Delete requests don't need data
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
