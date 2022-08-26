import axios from 'axios';
import Cookies from 'js-cookie';

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
  async Request(url, method, data, useToken,
    headers = { 'content-type': 'application/json; charset=utf-8' }, sendDataRaw = false) {
    try {
      if (useToken) {
        if (!Cookies.get('access_token')) {
          throw new Error('No access token found');
        } else {
          headers.Authorization = `Bearer ${Cookies.get('access_token')}`;
        }
      }
      headers['X-edrop-userbase'] = Cookies.get('access_token');
      const options = {
        method,
        headers,
        url,
      };

      const dataToSend = (sendDataRaw) ? data : JSON.stringify(data);
      if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        options.data = dataToSend;
      } else {
        options.params = dataToSend;
      }

      const res = await axios(options);
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new API();
