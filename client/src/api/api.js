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
     * @param {boolean} sendDataRaw - optional, if true, send data without JSON.stringify
     */
    async Request(url, method, data, useToken, 
                  headers = {'content-type':'application/json; charset=utf-8'}, sendDataRaw=false){
        try{
            if(useToken){
                if(Cookies.get('access_token')===null || Cookies.get('access_token')===undefined){
                    headers.Authorization = Cookies.get('base_access_token');
                }else{
                    headers.Authorization = Cookies.get('access_token');
                }
            } 
            headers['X-edrop-userbase'] =  Cookies.get('base_access_token');   
            let options = {
                method: method,
                headers: headers,
                url: url
            };

            if(!sendDataRaw){
                options.data = JSON.stringify(data)
            } else {
                options.data = data
            }

            let res = await axios(options);
            return res;
        }catch(error){
            console.error(error);
            throw error;
        }
    }
}

export default new API();
