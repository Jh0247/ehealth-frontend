import React, { useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import homeIcon from '@iconify-icons/mdi/home';
import menuIcon from '@iconify-icons/mdi/menu';
import { Link as ScrollLink } from 'react-scroll';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const renderNavItems = () => (
    <>
      <ScrollLink to="about" smooth={true} duration={500} className="text-gray-700 hover:text-[#63D4D5] cursor-pointer" onClick={handleNavClick}>About</ScrollLink>
      <ScrollLink to="collaboration" smooth={true} duration={500} className="text-gray-700 hover:text-[#63D4D5] cursor-pointer" onClick={handleNavClick}>Collaboration</ScrollLink>
      <ScrollLink to="contact" smooth={true} duration={500} className="text-gray-700 hover:text-[#63D4D5] cursor-pointer" onClick={handleNavClick}>Contact</ScrollLink>
      <RouterLink to="/login" className="ml-4 px-4 py-2 bg-[#347576] text-white rounded hover:bg-[#285D5E]">Login</RouterLink>
    </>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          {location.pathname === '/' ? (
            <ScrollLink to="top" smooth={true} duration={500} className="text-2xl font-bold text-[#347576] cursor-pointer" onClick={handleNavClick}>E-Health</ScrollLink>
          ) : (
            <RouterLink to="/" className="text-2xl font-bold text-[#347576]">E-Health</RouterLink>
          )}
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
            <RouterLink to="/" className="text-2xl font-bold text-[#347576]">
              <Icon icon={homeIcon} width="24" height="24" />
            </RouterLink>
          </div>
        )}
        {location.pathname === '/collaboration-request' && (
          <RouterLink to="/login" className="ml-4 px-4 py-2 bg-[#347576] text-white rounded hover:bg-[#285D5E]">Login</RouterLink>
        )}
      </div>
      {isOpen && location.pathname === '/' && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 border-t border-gray-200 px-4">
          <ScrollLink to="about" smooth={true} duration={500} className="block px-4 py-2 text-gray-700 hover:text-[#63D4D5] border-t border-gray-200" onClick={handleNavClick}>About</ScrollLink>
          <ScrollLink to="collaboration" smooth={true} duration={500} className="block px-4 py-2 text-gray-700 hover:text-[#63D4D5] border-t border-gray-200" onClick={handleNavClick}>Collaboration</ScrollLink>
          <ScrollLink to="contact" smooth={true} duration={500} className="block px-4 py-2 text-gray-700 hover:text-[#63D4D5] border-t border-b border-gray-200" onClick={handleNavClick}>Contact</ScrollLink>
          <RouterLink to="/login" className="block w-full px-4 py-2 bg-[#347576] text-white text-center rounded hover:bg-[#285D5E] mt-2 mb-2">Login</RouterLink>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
