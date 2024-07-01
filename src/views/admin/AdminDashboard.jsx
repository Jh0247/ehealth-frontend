import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRegistrations, fetchBlogpostStatus, fetchAppointmentsByType, fetchSalesOverTime, fetchMedicationsSold } from '../../redux/features/statisticsSlice';
import { getCollaborationRequests, approveCollaborationRequest, declineCollaborationRequest } from '../../redux/features/collaborationSlice';
import { Bar, Line, Pie } from 'react-chartjs-2';
import CollaborationDetailsModal from './CollaborationDetailsModal';
import 'chart.js/auto';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { userRegistrations, blogpostStatus, appointmentsByType, salesOverTime, medicationsSold, status } = useSelector((state) => state.statistics);
  const { requests: collaborationRequests, status: collaborationStatus } = useSelector((state) => state.collaboration);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    dispatch(fetchUserRegistrations());
    dispatch(fetchBlogpostStatus());
    dispatch(fetchAppointmentsByType());
    dispatch(fetchSalesOverTime());
    dispatch(fetchMedicationsSold());
    dispatch(getCollaborationRequests());
  }, [dispatch]);

  const handleOpenModal = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  const handleApprove = (userId) => {
    dispatch(approveCollaborationRequest(userId)).then(dispatch(getCollaborationRequests()));
    handleCloseModal();
  };

  const handleDecline = (userId) => {
    dispatch(declineCollaborationRequest(userId)).then(dispatch(getCollaborationRequests()));
    handleCloseModal();
  };

  const renderUserRegistrationsChart = () => {
    const data = {
      labels: userRegistrations?.map((reg) => reg.date) || [],
      datasets: [
        {
          label: 'User Registrations',
          data: userRegistrations?.map((reg) => reg.count) || [],
          backgroundColor: 'rgba(75,192,192,0.4)',
        },
      ],
    };
    return <Line data={data} />;
  };

  const renderBlogpostStatusChart = () => {
    const data = {
      labels: blogpostStatus?.map((status) => status.status) || [],
      datasets: [
        {
          label: 'Blogpost Status',
          data: blogpostStatus?.map((status) => status.count) || [],
          backgroundColor: ['rgba(75,192,192,0.4)', 'rgba(255,99,132,0.4)', 'rgba(54,162,235,0.4)'],
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      responsive: true,
    };
    return (
      <div className="relative w-full h-64">
        <Pie data={data} options={options} />
      </div>
    );
  };

  const renderAppointmentsByTypeChart = () => {
    const data = {
      labels: appointmentsByType?.map((type) => type.type) || [],
      datasets: [
        {
          label: 'Appointments by Type',
          data: appointmentsByType?.map((type) => type.count) || [],
          backgroundColor: ['rgba(75,192,192,0.4)', 'rgba(255,99,132,0.4)'],
        },
      ],
    };
    return <Bar data={data} />;
  };

  const renderSalesOverTimeChart = () => {
    const data = {
      labels: salesOverTime?.map((sale) => sale.date) || [],
      datasets: [
        {
          label: 'Sales Over Time',
          data: salesOverTime?.map((sale) => sale.total) || [],
          backgroundColor: 'rgba(54,162,235,0.4)',
        },
      ],
    };
    return <Line data={data} />;
  };

  const renderMedicationsSoldChart = () => {
    const data = {
      labels: medicationsSold?.map((med) => med.medication_name) || [],
      datasets: [
        {
          label: 'Medications Sold',
          data: medicationsSold?.map((med) => med.total_sold) || [],
          backgroundColor: 'rgba(153,102,255,0.4)',
        },
      ],
    };
    return <Bar data={data} />;
  };

  return (
    <div className="flex flex-col p-5 md:p-9 bg-white min-h-screen">
      <h3 className="text-xl md:text-2xl font-bold mb-6 text-black">Admin Dashboard</h3>
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <div className="bg-white p-4 rounded-lg shadow-md shadow-teal-800">
            <h2 className="text-lg font-bold mb-4 text-black">User Registrations</h2>
            {status === 'loading' ? <p className="text-black">Loading...</p> : renderUserRegistrationsChart()}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md shadow-teal-800">
            <h2 className="text-lg font-bold mb-4 text-black">Appointments by Type</h2>
            {status === 'loading' ? <p className="text-black">Loading...</p> : renderAppointmentsByTypeChart()}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md shadow-teal-800">
            <h2 className="text-lg font-bold mb-4 text-black">Sales Over Time</h2>
            {status === 'loading' ? <p className="text-black">Loading...</p> : renderSalesOverTimeChart()}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md shadow-teal-800">
            <h2 className="text-lg font-bold mb-4 text-black">Medications Sold</h2>
            {status === 'loading' ? <p className="text-black">Loading...</p> : renderMedicationsSoldChart()}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md shadow-teal-800">
            <h2 className="text-lg font-bold mb-4 text-black">Blogpost Status</h2>
            {status === 'loading' ? <p className="text-black">Loading...</p> : renderBlogpostStatusChart()}
          </div>
          {collaborationRequests && collaborationRequests.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md shadow-teal-800 overflow-y-auto max-h-[350px]">
              <h2 className="text-lg font-bold mb-4 text-black">Collaboration Requests</h2>
              {collaborationStatus === 'loading' ? (
                <p className="text-black">Loading...</p>
              ) : (
                <table className="min-w-full divide-gray-200 ">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-gray-200">
                    {collaborationRequests?.map((request) => (
                      <tr key={request.id} onClick={() => handleOpenModal(request)} className="cursor-pointer">
                        <td className="bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.name}</td>
                        <td className="bg-gray-50 px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
      {selectedRequest && (
        <CollaborationDetailsModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          request={selectedRequest}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
