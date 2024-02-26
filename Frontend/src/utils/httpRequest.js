import axios from 'axios';

const httpRequest = axios.create({
    baseURL: import.meta.env.REACT_APP_BASE_URL,
});

export const get = async (path, options = {}) => {
    const response = await httpRequest.get(path, options);
    return response.data;
};

export const post = async (path, data, options = {}) => {
    const response = await httpRequest.post(path, data, options);
    return response.data;
};

export const put = async (path, data, options = {}) => {
    const response = await httpRequest.put(path, data, options);
    return response.data;
};

export const del = async (path, options = {}) => {
    const response = await httpRequest.delete(path, options);
    return response.data;
};

// httpRequest.interceptors.request.use(function (config) {
//     const token =
//         "Bearer " + JSON.parse(localStorage.getItem("token"))?.token;
//     if (token) {
//         config.headers.Authorization = token;
//     }
//     return config;
// });

export default httpRequest;
