import React from 'react';
import healthcareImage from '../../assets/healthcareImage.png';
import hipaaLogo from '../../assets/hipaa.png';

export default function Landing() {
  return (
    <div className="relative">
      <div id="top" className="bg-cover bg-center relative h-screen bg-wave">
        <div className="container mx-auto px-3 md:px-20 text-center md:text-left relative z-10 flex flex-col md:flex-row items-center h-full">
          <div className="w-full md:w-1/2 mt-20 md:-mt-72">
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-10 md:mt-0">E-Health</h1>
            <p className="text-md mdL:text-3xl text-white mt-4 mb-10 md:mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <img src={healthcareImage} alt="Healthcare" className="w-80 md:w-96" />
          </div>
        </div>
      </div>
      
      {/* About Us Section */}
      <section id="about" className="py-20 bg-white relative z-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">ABOUT US</h2>
          <p className="mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
        </div>
      </section>

      {/* Regulation Certification Section */}
      <section className="py-20 bg-gray-100 relative z-20">
        <div className="container mx-auto px-4 text-center flex flex-col md:flex-row items-center">
          <h2 className="text-2xl font-bold mb-6 md:mb-0 md:mr-6">Regulation Certification</h2>
          <div className="flex justify-center">
            <img src={hipaaLogo} alt="HIPAA Logo" className="w-40 md:w-52" />
          </div>
          <div className="md:ml-6 mt-6 md:mt-0">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          </div>
        </div>
      </section>

      {/* Join Collaboration Section */}
      <section id="collaboration" className="py-20 bg-white relative z-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Collaboration</h2>
          <p className="mb-6">Current collaborative organization</p>
          <div className="bg-gray-100 p-8 rounded shadow-md mb-6">
            <ul>
              <li className="mb-4">Lorem Ipsum</li>
              <li className="mb-4">Lorem Ipsum</li>
              <li className="mb-4">Lorem Ipsum</li>
              <li className="mb-4">Lorem Ipsum</li>
            </ul>
          </div>
          <a href="/collaboration-request" className="px-4 py-2 bg-[#347576] text-white rounded hover:bg-[#285D5E]">Join Now</a>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 bg-gray-100 relative z-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <div className="bg-white p-8 rounded shadow-md">
            <form>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700">Email</label>
                <input type="email" id="email" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700">Your Message</label>
                <textarea id="message" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
              </div>
              <button type="submit" className="px-4 py-2 bg-[#347576] text-white rounded hover:bg-[#285D5E]">Submit</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
