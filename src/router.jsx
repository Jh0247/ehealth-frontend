import { createBrowserRouter, Navigate } from "react-router-dom";

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
import HealthRecord from "./views/shared/HealthRecord";
import AppointmentList from "./views/shared/AppointmentList";
import ViewAppointmentDetails from "./views/shared/ViewAppointmentDetails";
import BlogpostDetails from "./views/shared/BlogpostDetails";

// Admin Views
import AdminDashboard from "./views/admin/AdminDashboard";
import OrganizationList from "./views/admin/OrganizationList";
import ManageBlogpost from "./views/admin/ManageBlogpost";
import ManageMedication from "./views/admin/ManageMedication";

// Patient Views
import PatientDashboard from "./views/patient/PatientDashboard";
import BookAppointment from "./views/patient/BookAppointment";
import PurchaseRecord from "./views/patient/PurchaseRecord";

// Healthcare Views
import HealthcareDashboard from "./views/healthcare/HealthcareDashboard";
import MyBlogpost from "./views/healthcare/MyBlogpost";
import CreationBlogpost from "./views/healthcare/CreationBlogpost";
import MyPatients from "./views/healthcare/MyPatients";
import MyStaff from "./views/healthcare/MyStaff";

// Pharmacist Views
import PharmacistDashboard from "./views/pharmacist/PharmacistDashboard";
import ManagePurchaseRecord from "./views/pharmacist/ManagePurchaseRecord";
import AddPurchaseRecord from "./views/pharmacist/AddPurchaseRecord";

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
    path: 'e-admin',
    element: <AdminLayout />,
    children: [
      { path: '', element: <Navigate to='dashboard' /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'organization-list', element: <OrganizationList /> },
      { path: 'manage-blogpost', element: <ManageBlogpost /> },
      { path: 'blogpost-details/:id', element: <BlogpostDetails /> },
      { path: 'manage-medication', element: <ManageMedication /> },
    ]
  },
  {
    path: 'user',
    element: <PatientLayout allowedRoles={['user']} />,
    children: [
      { path: '', element: <Navigate to='dashboard' /> },
      { path: 'dashboard', element: <PatientDashboard /> },
      { path: 'health-record', element: <HealthRecord /> },
      { path: 'blogpost', element: <ViewBlogpost /> },
      { path: 'book-appointment', element: <BookAppointment /> },
      { path: 'appointment-list', element: <AppointmentList /> },
      { path: 'appointment-details', element: <ViewAppointmentDetails /> },
      { path: 'blogpost-details/:id', element: <BlogpostDetails /> },
      { path: 'purchase-record', element: <PurchaseRecord /> },
    ]
  },
  {
    path: 'healthcare',
    element: <HealthcareLayout />,
    children: [
      { path: '', element: <Navigate to='dashboard' /> },
      { path: 'dashboard', element: <HealthcareDashboard /> },
      { path: 'health-record', element: <HealthRecord /> },
      { path: 'patient-list', element: <MyPatients /> },
      { path: 'staff-list', element: <MyStaff /> },
      { path: 'appointment-list', element: <AppointmentList /> },
      { path: 'appointment-details', element: <ViewAppointmentDetails /> },
      { path: 'blogpost', element: <ViewBlogpost /> },
      { path: 'blogpost-details/:id', element: <BlogpostDetails /> },
      { path: 'my-blog', element: <MyBlogpost /> },
      { path: 'creation-blog', element: <CreationBlogpost /> },
    ]
  },
  {
    path: 'pharmacist',
    element: <PharmacistLayout />,
    children: [
      { path: '', element: <Navigate to='dashboard' /> },
      { path: 'dashboard', element: <PharmacistDashboard /> },
      { path: 'blogpost', element: <ViewBlogpost /> },
      { path: 'manage-purchase-record', element: <ManagePurchaseRecord /> },
      { path: 'add-purchase-record', element: <AddPurchaseRecord /> },
      { path: 'blogpost-details/:id', element: <BlogpostDetails /> },
    ]
  },
  { path: '*', element: <NotFound /> }
]);

export default router;
