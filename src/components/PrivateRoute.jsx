import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({ allowedRoles = [], organizationCheck }) => {
  const user = useSelector(state => state.user);
  const { user_info: { user_role, organization_id } } = user;
  console.log('private route', user);

  // When user state is empty
  if (!user || !user.user_info) {
    return <Navigate to='/login' />;
  }
  // For healthcare provider
  if (!allowedRoles.includes(user_role) || (organizationCheck && organizationCheck === organization_id)) {
    console.log('allowedRoles', allowedRoles);
    console.log('user_role', user_role);
    console.log('organizationCheck', organizationCheck);
    console.log('organization_id', organization_id);
    return <Navigate to="/" />;
  }

  console.log('i am here', user);
  return <Outlet />;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.array.isRequired,
  organizationCheck: PropTypes.number,
};

export default PrivateRoute;
