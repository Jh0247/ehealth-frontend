import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../redux/features/toastSlice";

const Toast = () => {
  const dispatch = useDispatch();

  const { open, title, message, type } = useSelector((state) => state.toast);
  const [hideAnimation, setHideAnimation] = useState(false);

  const variantType = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'info':
        return 'bg-cyan-100 border-cyan-500 text-cyan-700';
      case 'warning':
        return 'bg-orange-100 border-orange-500 text-orange-700';
    }
  };

  useEffect(() => {
    if (open) {
      setHideAnimation(false);
      const timer = setTimeout(() => {
        setHideAnimation(true);
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, dispatch]);

  const handleClose = () => {
    setHideAnimation(true);
    dispatch(hideToast());
  };


  if (!open) return null;

  return (
    <div className={`border-b-4 ${variantType(type)} fixed top-0 left-0 w-full shadow-lg z-50 ${hideAnimation ? 'animate-slideUp' : 'animate-slideDown'}`}>
      <div className="flex justify-between items-center p-4 max-w-screen-xl mx-auto">
        <div className="flex items-center">
          <strong className="mr-2">{title}:</strong>
          <span>{message}</span>
        </div>
        <button onClick={handleClose} className="text-xl font-bold ml-4 text-gray-700 hover:text-gray-900 focus:outline-none">
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
