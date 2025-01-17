import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/features/authSlice';
import { setUser } from '../../redux/features/userSlice';
import { Icon } from '@iconify/react';
import emailIcon from '@iconify-icons/mdi/email';
import lockIcon from '@iconify-icons/mdi/lock';
import eyeIcon from '@iconify-icons/mdi/eye';
import eyeOffIcon from '@iconify-icons/mdi/eye-off';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      loginUser({
        email,
        password
      })
    );
    if (result.type === 'auth/loginUser/fulfilled') {
      dispatch(setUser(result.payload.user));
      let role = result?.payload?.user?.user_role;
      if (role === 'admin' || role === 'doctor' || role === 'nurse') {
        navigate('/healthcare/dashboard');
      } else {
        navigate('/'+role+'/dashboard');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center md:items-center min-h-screen bg-cover bg-center bg-wave">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md mt-20 md:mt-0 mx-2 md:mx-0 h-fit bg-opacity-90">
        <h2 className="text-2xl font-bold text-[#347576] mb-6 text-center md:text-left">Login</h2>
        <form onSubmit={handleSubmit}>
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
                required
              />
            </div>
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={lockIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                className="w-full outline-none pr-10" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
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
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-[#347576] text-white rounded hover:bg-[#285D5E] focus:outline-none focus:ring-2 focus:ring-[#63D4D5]"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm md:text-base">
          Dont have an account? <a href="/register" className="text-[#63D4D5] hover:underline">Register</a> now
        </p>
      </div>
    </div>
  );
};

export default Login;