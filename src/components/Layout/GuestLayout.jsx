import { useSelector } from 'react-redux';
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../Navbar";
import PrivateRoute from '../PrivateRoute';

export default function GuestLayout() {
  const user = useSelector((state) => state.user);
  // todo: what is logged in user here
  if (!user?.token) {
    // console.log(user?.user_info?.user_role)
    // return <Navigate to="/${user?.user_info?.user_role}" />;
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}