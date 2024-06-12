import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import logoutIcon from '@iconify-icons/mdi/logout';
import menuIcon from '@iconify-icons/mdi/menu';
import chevronLeft from '@iconify-icons/mdi/chevron-left';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/features/authSlice';
import { clearUser } from '../redux/features/userSlice';

const Sidebar = ({ navItems, onToggleSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
  };

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
      setIsOpen(false);
      onToggleSidebar(false);
    } else {
      setIsMobile(false);
      setIsOpen(true);
      onToggleSidebar(true);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggleSidebar(newIsOpen);
  };

  return (
    <>
      <div className={`bg-white text-[#285D5E] h-screen flex flex-col ${isOpen ? 'w-52' : 'w-14'} transition-all duration-300 shadow-lg fixed z-50 md:h-screen`}>
        <div className="flex items-center justify-between p-4 shadow-md">
          {isOpen && <div className="text-xl font-bold">E-Health</div>}
          <button 
            className="text-[#285D5E] focus:outline-none" 
            onClick={toggleSidebar}
          >
            <Icon icon={isOpen ? chevronLeft : menuIcon} className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-4 flex-1">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-2 mb-1 rounded-lg transition-colors duration-200 relative ${
                location.pathname === item.path
                  ? 'bg-[#E6F7F7] text-[#285D5E] after:content-[""] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-1 after:bg-[#285D5E]'
                  : 'hover:bg-[#E6F7F7]'
              }`}
            >
              <Icon icon={item.icon} className="w-6 h-6" />
              {isOpen && <span className="ml-2">{item.name}</span>}
            </Link>
          ))}
        </nav>
        <div className={`mt-auto mb-4 ${isOpen ? 'px-4' : 'px-1'}`}>
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full px-4 py-2 text-[#285D5E] bg-[#E6F7F7] rounded-lg hover:bg-[#63D4D5] focus:outline-none transition-colors duration-200"
          >
            <Icon icon={logoutIcon} className="w-6 h-6" />
            {isOpen && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </div>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => {
            setIsOpen(false);
            onToggleSidebar(false);
          }}
        ></div>
      )}
      <div className={`transition-transform duration-300 ${isOpen && isMobile ? 'transform translate-x-56' : ''}`}></div>
    </>
  );
};

Sidebar.propTypes = {
  navItems: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
  })).isRequired,
  onToggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;