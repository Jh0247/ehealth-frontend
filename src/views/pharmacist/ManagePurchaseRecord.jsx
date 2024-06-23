import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPurchasesByOrganization, deletePurchaseRecord } from '../../redux/features/purchaseSlice';
import { getAppointmentsByOrganization } from '../../redux/features/healthcareProviderSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ManagePurchaseRecord() {
  const dispatch = useDispatch();
  const { user_info } = useSelector((state) => state.user);
  const { purchases, status } = useSelector((state) => state.purchase);
  const { appointments, appointmentStatus } = useSelector((state) => state.healthcareProvider);
  const [activeTab, setActiveTab] = useState('appointment');

  useEffect(() => {
    if (user_info?.organization_id) {
      dispatch(fetchAllPurchasesByOrganization(user_info.organization_id));
      dispatch(getAppointmentsByOrganization(user_info.organization_id));
    }
  }, [dispatch, user_info?.organization_id]);

  const handleDeletePurchase = (id) => {
    dispatch(deletePurchaseRecord(id));
  };

  const renderPurchases = (purchasesList) => (
    purchasesList.map(purchase => (
      <div key={purchase.id} className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 flex flex-col items-center text-center mb-4">
        <h4 className="text-lg mb-2">Purchase ID: {purchase.id}</h4>
        <p className="mb-2">Total Payment: {purchase.total_payment}</p>
        <p className="mb-2">Date of Purchase: {new Date(purchase.date_purchase).toLocaleDateString()}</p>
        <button
          className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
          onClick={() => handleDeletePurchase(purchase.id)}
        >
          Delete Purchase
        </button>
      </div>
    ))
  );

  const renderAppointments = (appointmentsList) => (
    appointmentsList.map(appointment => (
      <div key={appointment.id} className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 flex flex-col items-center text-center mb-4">
        <h4 className="text-lg mb-2">Appointment ID: {appointment?.id}</h4>
        <p className="mb-2">Patient: {appointment?.user?.name}</p>
        <p className="mb-2">Date of Appointment: {new Date(appointment.appointment_datetime).toLocaleDateString()}</p>
        {/* Add more fields as needed */}
      </div>
    ))
  );

  return (
    <div className="flex flex-col p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6">Manage Purchase Record</h3>
      <div className="flex justify-between mb-4">
        <button
          className={`py-2 px-4 ${activeTab === 'appointment' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-lg`}
          onClick={() => setActiveTab('appointment')}
        >
          By Appointment
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'patient' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-lg`}
          onClick={() => setActiveTab('patient')}
        >
          By Patient
        </button>
      </div>

      {activeTab === 'appointment' && (
        <div>
          {appointmentStatus === 'loading' ? (
            <Skeleton count={5} height={100} />
          ) : (
            Array.isArray(appointments?.data) ? renderAppointments(appointments?.data.filter(a => a.status === 'completed')) : <p>No appointments found.</p>
          )}
        </div>
      )}
    </div>
  );
}
