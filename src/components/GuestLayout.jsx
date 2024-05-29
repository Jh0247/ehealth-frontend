import { useSelector } from 'react-redux';
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import PrivateRoute from './PrivateRoute';

export default function GuestLayout() {
  const user = useSelector((state) => state.user);

  if(user?.token) {
    console.log('guest navigation', user);
    if(user?.user_info?.user_role === 'admin' && user?.user_info?.organization_id === 1) {
      return <PrivateRoute allowedRoles={['admin']} />
    } else if(user?.user_info?.user_role === 'admin' && 
              user?.user_info?.user_role === 'doctor' && 
              user?.user_info?.user_role === 'nurse' && 
              !user?.user_info?.organization_id === 1) {
      return <PrivateRoute allowedRoles={['admin', 'doctor', 'nurse']} organizationCheck={1} />
    } else if (user?.user_info?.user_role === 'pharmacist' && !user?.user_info?.organization_id === 1) {
      return <PrivateRoute allowedRoles={['pharmacist']} organizationCheck={1} />
    } else if (user?.user_info?.user_role === 'user' && user?.user_info?.organization_id === 1) {
      return <PrivateRoute allowedRoles={['user']} />
    } else {
      return;
    }
  }

  // <PrivateRoute allowedRoles={['admin']} />
  // <PrivateRoute allowedRoles={['user']}/>
  // <PrivateRoute allowedRoles={['admin', 'doctor', 'nurse']} organizationCheck={1} />
  // <PrivateRoute allowedRoles={['pharmacist']} organizationCheck={1} />


  return (
    <div>
      guest
      <Navbar user={user}/>
      <Outlet />
    </div>
  );
}