import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const user = useSelector(state => state.user);
  const { user_info: { user_role, organization_id } } = user;
  // allowedRoles={['pharmacist']}

  // Navigate to login when no user info
  if (!user || !user.user_info) {
    return <Navigate to='/login' />;
  }

  // For E-Health Admin
  if (user_role === 'e-admin') {
    console.warn('here is ehealth admin')
    return <Outlet />;
  }

  // For healthcare provider
  if ((!organization_id == 1) && (user_role !== 'user') && (user_role !== 'e-admin')) {
    console.warn('here is healthcare')
    return <Outlet />;
  }

  // For patient
  if (user_role === 'user') {
    return <Outlet />;
  }

  // return navigate to user_role/dashboard
  if (user_role === 'admin' || user_role === 'doctor' || user_role === 'nurse') {
    return <Outlet />;
  }
  
  console.warn('here is user')

  if (user_role === 'admin' || user_role === 'doctor' || user_role === 'nurse') {
    return <Navigate to="/healthcare/dashboard" />;

    // return <Navigate to={`/${user_role}/dashboard`} />;
  } else {
    return <Navigate to={`/${user_role}/dashboard`} />;
  }
};

export default PrivateRoute;
