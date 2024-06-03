import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request URL:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;