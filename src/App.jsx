import React, { useEffect } from 'react';
import './index.css'
import router from './router.jsx'
import { RouterProvider } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Toast from './components/Toast.jsx'
import Loading from './components/Loading.jsx'
import setToken from './Utils/axiosSetAuthToken.js';

const App = () => {
  const loading = useSelector((state) => state.loading);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Token from localStorage:', token); // Debugging log
    if (token) {
      setToken(token);
      console.log('Token set to axios headers'); // Debugging log
    }
  }, []);

  return (
    <>
      {loading && <Loading />}
      <RouterProvider router={router} />
      <Toast />
    </>
  );
};

export default App;