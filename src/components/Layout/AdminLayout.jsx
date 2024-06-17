import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import dashboardIcon from '@iconify-icons/mdi/view-dashboard';
import personIcon from '@iconify-icons/mdi/account';
import articleIcon from '@iconify-icons/mdi/post';

export default function AdminLayout() {
  const user = useSelector(state => state.user);
  const auth = useSelector((state) => state.auth);
  const { user_info: { user_role } } = user;
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  if (user_role !== 'e-admin') {
    if (user_role === 'admin' || user_role === 'doctor' || user_role === 'nurse') {
      return <Navigate to="/healthcare/dashboard" />;
    } else {
        return <Navigate to={`/${user_role}/dashboard`} />;
    }
  }

  const navItems = [
    { name: 'Dashboard', path: '/user/dashboard', icon: dashboardIcon },
    { name: 'Health Record', path: '/user/health-record', icon: personIcon },
    { name: 'Blog Post', path: '/user/blogpost', icon: articleIcon },
  ];

  const handleToggleSidebar = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-auto">
        <Sidebar navItems={navItems} onToggleSidebar={handleToggleSidebar} />
        <div className={`flex flex-1 flex-col transition-transform duration-300 ${isMobile ? (isMobile ? 'ml-14' : 'ml-52') : (isSidebarOpen ? 'ml-52' : 'ml-14')}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
