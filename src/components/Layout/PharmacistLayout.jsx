import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import dashboardIcon from '@iconify-icons/mdi/view-dashboard';
import personIcon from '@iconify-icons/mdi/account';
import articleIcon from '@iconify-icons/mdi/post';

export default function PharmacistLayout() {
  const auth = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!auth?.token) {
    return <Navigate to="/login" />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/user/dashboard', icon: dashboardIcon },
    { name: 'Profile', path: '/user/profile', icon: personIcon },
    { name: 'Blog Post', path: '/user/blogpost', icon: articleIcon },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar navItems={navItems} isMobile={isMobile} />
      <div className={`flex-1 p-4 transition-transform duration-300 ${isMobile && 'ml-14'}`}>
        <Outlet />
      </div>
    </div>
  );
}
