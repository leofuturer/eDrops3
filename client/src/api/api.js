//Backend API lists
import axios from 'axios'
import * as serverConfig from './serverConfig'
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
            let requestUrl = "";
            if(useToken){
                if(url.indexOf('?') > -1){
                    requestUrl = url + `&access_token=${Cookies.get('access_token')}`;
                }
                else{
                    requestUrl = url + `?access_token=${Cookies.get('access_token')}`;
                }
            }
            else{
                requestUrl = url;
            }

            let options = {
                method:method,
                headers:headers,
                data:JSON.stringify(data),
                url: requestUrl
            }
            let res = await axios(options)
            //console.log(res)
            return res
        }catch(error){
            console.log(error)
            throw error;
        }
    }
}
export default new API();
