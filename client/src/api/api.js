import axios from 'axios'
import Cookies from 'js-cookie'

class API {
    /**
     * Custom function used to send request to backend APIs
     * @param {string} url - backend API url
     * @param {string} method - GET, POST, PATCH, DELETE, etc.
     * @param {object} params - JSON data to accompany request
     * @param {boolean} useToken - Use login token or not
     * @param {object} [headers] - optional, headers to accompany request
     */
    async Request(url, method, data, useToken, headers = {'content-type':'application/json; charset=utf-8'}){
        try{
            if(useToken){
                headers.Authorization = Cookies.get('access_token');
            }         
            let options = {
                method: method,
                headers: headers,
                data: JSON.stringify(data),
                url: url
            };
            let res = await axios(options);
            return res;
        }catch(error){
            console.error(error);
            throw error;
        }
    }
}

export default new API();
