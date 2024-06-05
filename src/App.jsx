import React from 'react'
import './index.css'
import router from './router.jsx'
import { RouterProvider } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Toast from './components/Toast.jsx'
import Loading from './components/Loading.jsx'

const App = () => {
  const loading = useSelector((state) => state.loading);

  return (
    <>
      {loading && <Loading />}
      <RouterProvider router={router} />
      <Toast />
    </>
  );
};

export default App;