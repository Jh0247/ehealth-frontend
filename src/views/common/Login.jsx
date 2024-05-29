import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/features/userSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // rmb to uncomment required fields
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email: "johndoe@example.com", password: "password" }));

    if (result.type === 'user/loginUser/fulfilled') {
      navigate('/'+result?.payload?.user?.user_role+'/dashboard'); // Redirect to the home page or dashboard
    }
  };

  return (
    <div className="bg-white p-4">
      <div className="flex justify-center">
        <div className="flex flex-col p-1">
          <form onSubmit={handleSubmit} className="mt-1 lg:mt-5 p-5 w-full sm:w-[600px]" method="post">
            <div className="text-2xl lg:text-3xl font-bold leading-10 text-zinc-900">
              Login
            </div>
            <div className="flex flex-col justify-center mt-5 bg-opacity-0">
              <label className="font-bold text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 text-neutral-800 p-4 mt-2"
                placeholder="example@email.com"
                // required
              />
            </div>
            <div className="flex flex-col justify-center mt-5 bg-opacity-0">
              <label className="font-bold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-100 text-neutral-800 p-4 mt-2 w-full"
                  placeholder="Enter password"
                  // required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {status === 'failed' && (
              <div className="text-red-500 mt-2">
                {error?.message || 'Login failed. Please try again.'}
              </div>
            )}
            <button
              type="submit"
              className="justify-center items-center p-4 mt-3.5 text-white bg-blue-600"
            >
              {status === 'loading' ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
