import { useSelector } from 'react-redux';
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../Navbar";

export default function GuestLayout() {
  const user = useSelector(state => state.user);
  const auth = useSelector((state) => state.auth);

  if (auth?.token) {
    if (user?.user_info?.user_role === 'user') {
      return <Navigate to="/user/dashboard" />;
    } else if (user?.user_info?.user_role === 'e-admin') {
      return <Navigate to="/e-admin/dashboard" />;
    } else if (user?.user_info?.user_role === 'admin' || user?.user_info?.user_role === 'doctor' || user?.user_info?.user_role === 'nurse') {
      return <Navigate to="/healthcare/dashboard" />;
    } else if (user?.user_info?.user_role === 'pharmacist') {
      return <Navigate to="/pharmacist/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}