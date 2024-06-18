import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import dashboardIcon from '@iconify-icons/mdi/view-dashboard';
import personIcon from '@iconify-icons/mdi/account';
import magnifyIcon from '@iconify-icons/mdi/magnify';
import articleIcon from '@iconify-icons/mdi/post';
import peopleIcon from '@iconify-icons/mdi/people';

export default function HealthcareLayout() {
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

  if (!user_role === 'admin' || !user_role === 'doctor' || !user_role === 'nurse') {
    return <Navigate to={`/${user_role}/dashboard`} />;
  }

  const allNavItems = [
    { name: 'Dashboard', path: '/healthcare/dashboard', icon: dashboardIcon },
    { name: 'Consultation', path: '/healthcare/appointment-list', icon: magnifyIcon },
    { name: 'Manage Staff', path: '/healthcare/staff-list', icon: peopleIcon, roles: ['admin'] },
    { name: 'My Patient', path: '/healthcare/patient-list', icon: peopleIcon, roles: ['doctor'] },
    { name: 'Blog Post', path: '/healthcare/blogpost', icon: articleIcon },
  ];

  const navItems = allNavItems.filter(item => !item.roles || item.roles.includes(user_role));

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
