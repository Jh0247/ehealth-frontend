import axiosInstance from "./axiosSetup";

const setToken = (token) => {
  axiosInstance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
}

export default setToken;