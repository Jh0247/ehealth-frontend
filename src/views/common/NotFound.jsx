import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NotFound = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (auth?.token) {
      if (user?.user_info?.user_role === 'user') {
        navigate('/user/dashboard');
      } else if (user?.user_info?.user_role === 'e-admin') {
        navigate('/e-admin/dashboard');
      } else if (user?.user_info?.user_role === 'admin' || user?.user_info?.user_role === 'doctor' || user?.user_info?.user_role === 'nurse') {
        navigate('/healthcare/dashboard');
      } else if (user?.user_info?.user_role === 'pharmacist') {
        navigate('/pharmacist/dashboard');
      } else {
        navigate('/landing');
      }
    } else {
      navigate('/landing');
    }
  }, [auth, user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-2xl text-gray-700 mb-8">Page Not Found</p>
      <p className="text-xl text-gray-500">Redirecting...</p>
    </div>
  );
};

export default NotFound;
