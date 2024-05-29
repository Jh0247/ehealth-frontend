import { useSelector } from 'react-redux';
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function HealthcareLayout() {
  const user = useSelector((state) => state.user);

  if(!user?.token) {
    return <Navigate to="/login"/>
  }

  return (
    <div>
      HealthcareLayout
      <Navbar user={user}/>
      <Outlet />
    </div>
  );
}