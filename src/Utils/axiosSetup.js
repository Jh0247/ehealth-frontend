import axios from 'axios';
// import store from '../redux/store';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});


// to do: need to getStore but cannot get from ../redux/store

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const state = store.getState();
//     const user = state.user;
    
//     config.headers['Accept-Language'] = 'en';
//     if (user && user.token) {
//       config.headers.Authorization = `Bearer ${user.token}`;
//     }

//     console.log('Request:', config);
//     return config;
//   },
//   (error) => {
//     console.log('Request Error:', error);
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log('Response:', response);
//     return response;
//   },
//   (error) => {
//     console.log('Response Error:', error);
//     if (error.response) {
//       return Promise.reject(error.response);
//     }
//     return Promise.reject(error);
//   }
// );


export default axiosInstance;