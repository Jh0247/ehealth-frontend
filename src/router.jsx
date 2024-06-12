import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// Layouts
import GuestLayout from "./components/Layout/GuestLayout";
import AdminLayout from "./components/Layout/AdminLayout";
import PatientLayout from "./components/Layout/PatientLayout";
import HealthcareLayout from "./components/Layout/HealthcareLayout";
import PharmacistLayout from "./components/Layout/PharmacistLayout";

// Common Views
import Register from "./views/common/Register";
import Login from "./views/common/Login";
import Landing from "./views/common/Landing";
import NotFound from "./views/common/NotFound";
import SignUpOrganization from "./views/common/SignUpOrganization";
import ViewBlogpost from "./views/shared/ViewBlogpost";
import UserList from "./views/shared/UserList";
import ConsultationList from "./views/shared/ConsultationList";
import HealthRecord from "./views/shared/HealthRecord";

// Admin Views
import AdminDashboard from "./views/admin/AdminDashboard";
import OrganizationList from "./views/admin/OrganizationList";

// Patient Views
import PatientDashboard from "./views/patient/PatientDashboard";
import BookAppointment from "./views/patient/BookAppointment";

// Healthcare Views
import HealthcareDashboard from "./views/healthcare/HealthcareDashboard";

// Pharmacist Views
import PharmacistDashboard from "./views/pharmacist/PharmacistDashboard";
import ManagePurchaseRecord from "./views/pharmacist/ManagePurchaseRecord";

const router = createBrowserRouter([
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      { path: '', element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'collaboration-request', element: <SignUpOrganization /> },
    ]
  },
  {
    path: 'admin',
    element: <PrivateRoute allowedRoles={['admin']} />,
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
          { path: '', element: <Navigate to='dashboard' /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'organization-list', element: <OrganizationList /> },
          { path: 'staff-list', element: <UserList /> },
          { path: 'blogpost', element: <ViewBlogpost /> },
        ]
      }
    ]
  },
  {
    path: 'user',
    element: <PrivateRoute allowedRoles={['user']} />,
    children: [
      {
        path: '',
        element: <PatientLayout />,
        children: [
          { path: '', element: <Navigate to='dashboard' /> },
          { path: 'dashboard', element: <PatientDashboard /> },
          { path: 'health-record', element: <HealthRecord /> },
          { path: 'consultation', element: <ConsultationList /> },
          { path: 'blogpost', element: <ViewBlogpost /> },
          { path: 'book-appointment', element: <BookAppointment /> },
        ]
      }
    ]
  },
  {
    path: 'healthcare',
    element: <PrivateRoute allowedRoles={['admin', 'doctor', 'nurse']} organizationCheck={1} />,
    children: [
      {
        path: '',
        element: <HealthcareLayout />,
        children: [
          { path: '', element: <Navigate to='dashboard' /> },
          { path: 'dashboard', element: <HealthcareDashboard /> },
          { path: 'patient-list', element: <UserList /> },
          { path: 'blogpost', element: <ViewBlogpost /> },
        ]
      }
    ]
  },
  {
    path: 'pharmacist',
    element: <PrivateRoute allowedRoles={['pharmacist']} organizationCheck={1} />,
    children: [
      {
        path: '',
        element: <PharmacistLayout />,
        children: [
          { path: '', element: <Navigate to='dashboard' /> },
          { path: 'dashboard', element: <PharmacistDashboard /> },
          { path: 'manage-purchase-record', element: <ManagePurchaseRecord /> },
        ]
      }
    ]
  },
  { path: '*', element: <NotFound /> }
]);

export default router;
