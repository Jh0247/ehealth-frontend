import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import homeIcon from '@iconify-icons/mdi/home';
import menuIcon from '@iconify-icons/mdi/menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const renderNavItems = () => (
    <>
      <a href="#about" className="text-gray-700 hover:text-[#63D4D5]">About</a>
      <a href="#collaboration" className="text-gray-700 hover:text-[#63D4D5]">Collaboration</a>
      <a href="#contact" className="text-gray-700 hover:text-[#63D4D5]">Contact</a>
      <a href="/login" className="ml-4 px-4 py-2 bg-[#347576] text-white rounded hover:bg-[#285D5E]">Login</a>
    </>
  );

  return (
    <nav className="bg-white shadow-lg z-10 relative">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-[#347576]">E-Health</Link>
        </div>
        {location.pathname === '/' && (
          <>
            <div className="hidden md:flex space-x-9 items-center">
              {renderNavItems()}
            </div>
            <div className="md:hidden">
              <button 
                className="text-gray-700 focus:outline-none focus:text-[#63D4D5]"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Icon icon={menuIcon} width="24" height="24" />
              </button>
            </div>
          </>
        )}
        {location.pathname !== '/' && location.pathname !== '/collaboration-request' && (
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#347576]">
              <Icon icon={homeIcon} width="24" height="24" />
            </Link>
          </div>
        )}
        {location.pathname === '/collaboration-request' && (
          <a href="/login" className="ml-4 px-4 py-2 bg-[#347576] text-white rounded hover:bg-[#285D5E]">Login</a>
        )}
      </div>
      {isOpen && location.pathname === '/' && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 border-t border-gray-200 px-4">
          <a href="#about" className="block px-4 py-2 text-gray-700 hover:text-[#63D4D5] border-t border-gray-200">About</a>
          <a href="#collaboration" className="block px-4 py-2 text-gray-700 hover:text-[#63D4D5] border-t border-gray-200">Collaboration</a>
          <a href="#contact" className="block px-4 py-2 text-gray-700 hover:text-[#63D4D5] border-t border-b border-gray-200">Contact</a>
          <a href="/login" className="block w-full px-4 py-2 bg-[#347576] text-white text-center rounded hover:bg-[#285D5E] mt-2 mb-2">Login</a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
