import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import Cookies from "js-cookie";

class API {
    /**
     * Custom function used to send request to backend APIs
     * @param {string} url - backend API url
     * @param {string} method - GET, POST, PATCH, DELETE, etc.
     * @param {object} data - JSON data to accompany request
     * @param {boolean} useToken - Use login token or not
     * @param {object} params - URL parameters to be sent with request
     * @param {object} [headers] - optional, headers to accompany request
     * @param {boolean} sendDataRaw - optional, if true, send data without JSON.stringify
     */
    async Request(
        url: string,
        method: string,
        data: object,
        useToken: boolean,
        params? : object,
        headers: AxiosRequestHeaders = {
            "content-type": "application/json; charset=utf-8",
        },
        sendDataRaw: boolean = false
    ) {
        try {
            if (useToken) {
                if (
                    Cookies.get("access_token") === null ||
                    Cookies.get("access_token") === undefined
                ) {
                    headers.Authorization = Cookies.get(
                        "base_access_token"
                    ) as string;
                } else {
                    headers.Authorization = Cookies.get(
                        "access_token"
                    ) as string;
                }
            }
            headers["X-edrop-userbase"] = Cookies.get(
                "base_access_token"
            ) as string;
            const options: AxiosRequestConfig = {
                method,
                headers,
                url,
                data: sendDataRaw ? data : JSON.stringify(data),
                params,
            };

            const res = await axios(options);
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new API();
