import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import dashboardIcon from '@iconify-icons/mdi/view-dashboard';
import personIcon from '@iconify-icons/mdi/account';
import articleIcon from '@iconify-icons/mdi/post';

export default function PatientLayout() {
  const auth = useSelector((state) => state.auth);
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

  const navItems = [
    { name: 'Dashboard', path: '/user/dashboard', icon: dashboardIcon },
    { name: 'Health Record', path: '/user/health-record', icon: personIcon },
    { name: 'Consultation', path: '/user/blogpost', icon: articleIcon },
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
