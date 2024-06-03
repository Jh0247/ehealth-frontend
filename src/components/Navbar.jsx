import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-[#347576]">E-Health</div>
        </div>
        <div className="hidden md:flex space-x-4 items-center">
          <a href="#home" className="text-gray-700 hover:text-[#63D4D5]">Home</a>
          <a href="#services" className="text-gray-700 hover:text-[#63D4D5]">Services</a>
          <a href="#appointments" className="text-gray-700 hover:text-[#63D4D5]">Appointments</a>
          <a href="#doctors" className="text-gray-700 hover:text-[#63D4D5]">Doctors</a>
          <a href="#contact" className="text-gray-700 hover:text-[#63D4D5]">Contact</a>
          <button className="ml-4 px-4 py-2 bg-[#347576] text-white rounded hover:bg-[#285D5E]">Login</button>
        </div>
        <div className="md:hidden">
          <button 
            className="text-gray-700 focus:outline-none focus:text-[#63D4D5]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white">
          <a href="#home" className="block px-4 py-2 text-gray-700 hover:text-[#63D4D5]">Home</a>
          <a href="#services" className="block px-4 py-2 text-gray-700 hover:text-[#63D4D5]">Services</a>
          <a href="#appointments" className="block px-4 py-2 text-gray-700 hover:text-[#63D4D5]">Appointments</a>
          <a href="#doctors" className="block px-4 py-2 text-gray-700 hover:text-[#63D4D5]">Doctors</a>
          <a href="#contact" className="block px-4 py-2 text-gray-700 hover:text-[#63D4D5]">Contact</a>
          <button className="block w-full px-4 py-2 bg-[#347576] text-white rounded hover:bg-[#285D5E] mt-2">Login</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
