import axios from 'axios';

export const setToken = (token) => localStorage.setItem('token', token)
export const getToken = (token) => localStorage.getItem('token')
export const clearToken = () => localStorage.removeItem('token')

/**
 * 转换成CGI的请求
 * @returns {boolean}
 */
// create an axios instance
const service = axios.create({
    baseURL: 'http://localhost:5001/',
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 10000, // request timeout
});

// request interceptor
service.interceptors.request.use(
    (config) => {
        let token = getToken();
        if (token && token.length) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    (response) => {

        return response
    },
    (error) => {
        console.log('onRequest error', error)
        if (error.response && error.response.data){
            const respData = error.response.data;
            if (respData.message){
                return Promise.reject(new Error(respData.message))
            }
        }
        return Promise.reject(error)
    }
);

export default service;
