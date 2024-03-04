import axios from 'axios';

const httpRequest = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

export const get = async (path, options = {}) => {
    try {
        const response = await httpRequest.get(path, options)
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const post = async (path, data, options = {}) => {
    try {
        const response = await httpRequest.post(path, data, options);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const put = async (path, data, options = {}) => {
    try {
        const response = await httpRequest.put(path, data, options);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const del = async (path, options = {}) => {
    try {
        const response = await httpRequest.delete(path, options);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

httpRequest.interceptors.request.use(function (config) {
    // const token =
    //     "Bearer " + JSON.parse(localStorage.getItem("token"))?.token;
    // if (token) {
    //     config.headers.Authorization = token;
    // }
    config.headers = {
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Origin": "*",
    }
    return config;
});

export default httpRequest;