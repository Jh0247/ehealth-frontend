import { useSelector } from 'react-redux';
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function AdminLayout() {
  const user = useSelector((state) => state.user);

  if(!user?.token) {
    return <Navigate to="/login"/>
  }

  return (
    <div>
      admin
      <Navbar user={user}/>
      <Outlet />
    </div>
  );
}