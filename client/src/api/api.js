//Backend API lists
import axios from 'axios'
import * as serverConfig from './serverConfig'
import Cookies from 'js-cookie'

class API {    
    /**
     * custermer forget password
     *
     *
     */
    async forgetPass(params){
        try{
            let options = {
                method:'POST',
                headers: {'content-type':'application/json; charset=utf-8'},
                data:JSON.stringify(params),
                url: serverConfig.customerForgetPass
            }
            let res = await axios(options)
            return res
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    /*
    * A function used to send request to backend APIs
    * url
    * method: GET POST PATCH or others
    * useToken: false or true
    * headers: you can use it or not
    * */
    async Request(url, method, params, useToken, headers = {'content-type':'application/json; charset=utf-8'}){
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
                data:JSON.stringify(params),
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