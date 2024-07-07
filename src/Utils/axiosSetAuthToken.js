import axiosInstance from './axiosSetup';

const setToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }

  axiosInstance.interceptors.request.use((config) => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
}

export default setToken;
