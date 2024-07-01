import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../redux/features/authSlice';
import { Icon } from '@iconify/react';
import emailIcon from '@iconify-icons/mdi/email';
import lockIcon from '@iconify-icons/mdi/lock';
import eyeIcon from '@iconify-icons/mdi/eye';
import eyeOffIcon from '@iconify-icons/mdi/eye-off';
import accountIcon from '@iconify-icons/mdi/account';
import phoneIcon from '@iconify-icons/mdi/phone';
import idCardIcon from '@iconify-icons/mdi/id-card';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [icno, setIcno] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      registerUser({
        name,
        email,
        icno,
        contact,
        password,
        password_confirmation: passwordConfirmation
      })
    );
    if (result.type === 'auth/registerUser/fulfilled') {
      navigate('/login');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex justify-center md:items-center min-h-screen bg-cover bg-center bg-wave">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl mt-14 md:mt-0 mb-5 mx-2 h-fit bg-opacity-90">
        <h2 className="text-2xl font-bold text-[#347576] mb-6 text-center md:text-left">Register</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700">Name</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={accountIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type="text" 
                id="name" 
                className="w-full outline-none" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder='John Doe'
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={emailIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type="email" 
                id="email" 
                className="w-full outline-none" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder='johndoe@sample.com'
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="icno" className="block text-gray-700">IC Number</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={idCardIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type="text" 
                id="icno" 
                className="w-full outline-none" 
                value={icno} 
                onChange={(e) => setIcno(e.target.value)}
                placeholder='XXXXXX-XX-XXXX'
                pattern="\d{6}-\d{2}-\d{4}"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="contact" className="block text-gray-700">Contact Number</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={phoneIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type="text" 
                id="contact" 
                className="w-full outline-none" 
                value={contact} 
                onChange={(e) => setContact(e.target.value)} 
                placeholder='012-3456789'
                pattern="\d{3,4}-\d{7,8}"
                required
              />
            </div>
          </div>
          <div className="mb-6 relative col-span-1 md:col-span-2">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={lockIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                className="w-full outline-none pr-10" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder='********'
                minLength={8}
                required
              />
              <button 
                type="button" 
                className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                <Icon icon={showPassword ? eyeOffIcon : eyeIcon} className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="mb-6 relative col-span-1 md:col-span-2">
            <label htmlFor="passwordConfirmation" className="block text-gray-700">Confirm Password</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={lockIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                id="passwordConfirmation" 
                className="w-full outline-none pr-10" 
                value={passwordConfirmation} 
                onChange={(e) => setPasswordConfirmation(e.target.value)} 
                placeholder='********'
                minLength={8}
                required
              />
              <button 
                type="button" 
                className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={toggleConfirmPasswordVisibility}
              >
                <Icon icon={showConfirmPassword ? eyeOffIcon : eyeIcon} className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-[#347576] text-white rounded hover:bg-[#285D5E] focus:outline-none focus:ring-2 focus:ring-[#63D4D5]"
            >
              Register
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm md:text-base">
          Already have an account? <a href="/login" className="text-[#63D4D5] hover:underline">Login</a> now
        </p>
      </div>
    </div>
  );
};

export default Register;
