import axios from "axios";
import { API_BASE_URL } from "../statis/url";

const URL = API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const setToken = (token) => {
  axiosInstance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
};
export default axiosInstance;
export { axiosInstance, setToken };