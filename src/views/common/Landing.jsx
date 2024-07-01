import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import healthcareImage from '../../assets/healthcareImage.png';
import { getOrganizationList } from '../../redux/features/organizationSlice';
import emailjs from 'emailjs-com';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { popToast, ToastType } from '../../redux/features/toastSlice';

const Landing = () => {
  const dispatch = useDispatch();
  const { organizations } = useSelector(state => state.organization);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(getOrganizationList());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_email: email,
      message: message,
    };

    emailjs.send('service_ni5q7ts', 'template_axl0se1', templateParams, '99BpzdeMgVuF5dSZj')
      .then((response) => {
        dispatch(
          popToast({
            title: 'Success',
            message: 'The message had been sent, kindly check your email for reply.',
            type: ToastType.SUCCESS,
          })
        );
      }, (error) => {
        dispatch(
          popToast({
            title: 'Error',
            message: 'Some error occur, please try again later.',
            type: ToastType.ERROR,
          })
        );
      });
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 5
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <div className="relative">
      <div id="top" className="bg-cover bg-center relative h-screen bg-wave">
        <div className="container mx-auto px-3 md:px-20 text-center md:text-left relative z-10 flex flex-col md:flex-row items-center h-full">
          <div className="w-full md:w-1/2 mt-20 md:-mt-72">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-10 md:mt-0">E-Health</h1>
            <p className="text-md md:text-xl text-white mt-6 mb-10 md:mb-0">
              Connecting healthcare professionals and patients seamlessly through a collaborative health record system that 
              enhances communication, improves patient care, and ensures secure and efficient access to medical records.
            </p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <img src={healthcareImage} alt="Healthcare" className="w-80 md:w-96"/>
          </div>
        </div>
      </div>

      {/* Join Collaboration Section */}
      <section id="collaboration" className="py-20 bg-gray-300 h-screen">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mt-6 mb-12 text-gray-800">Join Collaboration</h2>
          <div className="p-4 sm:p-8 rounded-lg shadow-lg mb-6 max-h-[70vh] bg-[#77acad] backdrop-blur-sm">
            <h3 className="mb-6 text-center text-white font-bold text-xl md:text-2xl">Current collaborative organizations</h3>
            <Carousel responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={3000}>
              {organizations && organizations.length > 0 ? (
                organizations.map(org => (
                  <div key={org.id} className="bg-white p-4 rounded-lg shadow-md max-w-[255px] h-[50vh] flex flex-col justify-center text-center">
                    <h3 className="font-bold text-lg text-gray-800 mb-10">{org.name}</h3>
                    <p className="text-gray-600">{org.address}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No organizations found.</p>
              )}
            </Carousel>
          </div>
          <a href="/collaboration-request" className="inline-block px-8 py-3 bg-[#347576] text-white font-semibold rounded-full hover:bg-[#285D5E] w-[280px] transition">Join Now</a>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 bg-gray-600 h-screen">
        <div className="container mx-auto px-4 text-center min-h-[80vh] flex items-center justify-center">
          <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg w-full backdrop-blur-sm">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-white font-semibold">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#347576]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-white font-semibold">Message</label>
                <textarea
                  id="message"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#347576]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  required
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button type="submit" className="inline-block px-8 py-3 bg-[#347576] text-white font-semibold rounded-full hover:bg-[#285D5E] transition w-full">
                  Send Message
                  <span className="ml-2">→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
