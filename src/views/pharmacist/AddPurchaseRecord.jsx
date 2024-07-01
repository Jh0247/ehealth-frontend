import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUserByIcno, clearUserSearchResults } from '../../redux/features/appointmentSlice';
import { createPurchaseRecord, fetchAppointmentPrescriptions } from '../../redux/features/purchaseSlice';
import { getAppointmentsByOrganization } from '../../redux/features/healthcareProviderSlice';
import { fetchMedications } from '../../redux/features/medicationSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PrescriptionModal from './PrescriptionModal';
import PurchaseModal from './PurchaseModal';
import { popToast, ToastType } from '../../redux/features/toastSlice';
import noDataImage from '../../assets/noData.png';

export default function AddPurchaseRecord() {
  const dispatch = useDispatch();
  const { user_info } = useSelector((state) => state.user);
  const { userSearchResults, searchStatus } = useSelector((state) => state.appointment);
  const { appointments, appointmentStatus } = useSelector((state) => state.healthcareProvider);
  const { prescriptions, status: prescriptionStatus } = useSelector((state) => state.purchase);
  const { medications, status: medicationStatus } = useSelector((state) => state.medication);
  const [activeTab, setActiveTab] = useState('appointment');
  const [icno, setIcno] = useState('');
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentSearchTerm, setAppointmentSearchTerm] = useState('');

  useEffect(() => {
    if (user_info?.organization_id) {
      dispatch(getAppointmentsByOrganization(user_info.organization_id));
    }
    dispatch(fetchMedications());
  }, [dispatch, user_info?.organization_id]);

  useEffect(() => {
    if (icno) {
      const delayDebounceFn = setTimeout(() => {
        dispatch(searchUserByIcno(icno));
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    } else {
      dispatch(clearUserSearchResults());
    }
  }, [icno, dispatch]);

  const handleCreatePurchase = (data) => {
    data.forEach((purchase) => {
      dispatch(createPurchaseRecord(purchase))
        .then(() => {
          dispatch(
            popToast({
              title: 'Success',
              message: 'Record added into user account.',
              type: ToastType.SUCCESS,
            })
          );
          setIsPrescriptionModalOpen(false);
          setIsPurchaseModalOpen(false);
          setIcno('');
        })
        .catch((error) => {
          dispatch(
            popToast({
              title: 'Error',
              message: error.message,
              type: ToastType.ERROR,
            })
          );
        });
    });
  };

  const handleShowPrescriptions = (appointment) => {
    setSelectedAppointment(appointment);
    dispatch(fetchAppointmentPrescriptions(appointment.id)).then(() => {
      setIsPrescriptionModalOpen(true);
    });
  };

  const handleShowPurchaseModal = (user) => {
    setSelectedUser(user);
    setIsPurchaseModalOpen(true);
  };

  const filteredAppointments = appointments?.data?.filter(appointment => 
    appointment.status === 'completed' && appointment.id.toString().includes(appointmentSearchTerm)
  ) || [];

  const renderAppointments = (appointmentsList) => (
    appointmentsList.map(appointment => (
      <div key={appointment.id} className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 flex flex-col sm:flex-row justify-between items-center sm:text-left mb-4">
        <div className="flex flex-col">
          <h4 className="mb-2 text-sm sm:text-base">Appointment ID: <strong>{appointment?.id}</strong></h4>
          <p className="mb-2 text-sm sm:text-base">Patient: <strong>{appointment?.user?.name}</strong></p>
          <p className="mb-2 text-sm sm:text-base">Date of Appointment: <strong>{new Date(appointment.appointment_datetime).toLocaleDateString()}</strong></p>
        </div>
        <button
          className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 h-fit"
          onClick={() => handleShowPrescriptions(appointment)}
        >
          View Prescriptions
        </button>
      </div>
    ))
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'search') {
      dispatch(clearUserSearchResults());
      setIcno('');
      setSelectedUser(null);
    }
  };

  return (
    <div className="flex flex-col p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6">Add Purchase Record</h3>
      <div className="flex mb-4">
        <button
          className={`py-2 px-4 ${activeTab === 'appointment' ? 'bg-teal-800 text-white' : 'bg-gray-200 text-gray-700'} text-sm sm:text-base rounded-l`}
          onClick={() => handleTabChange('appointment')}
        >
          By Appointment
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'search' ? 'bg-teal-800 text-white' : 'bg-gray-200 text-gray-700'} text-sm sm:text-base rounded-r`}
          onClick={() => handleTabChange('search')}
        >
          Search User
        </button>
      </div>

      {activeTab === 'appointment' && (
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by Appointment ID"
              value={appointmentSearchTerm}
              onChange={(e) => setAppointmentSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2 text-sm sm:text-base"
            />
          </div>
          {appointmentStatus === 'loading' ? (
            <Skeleton count={5} height={100} />
          ) : (
            filteredAppointments.length > 0 ? renderAppointments(filteredAppointments) : <p>No appointments found.</p>
          )}
        </div>
      )}

      {activeTab === 'search' && (
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by IC Number"
              value={icno}
              onChange={(e) => setIcno(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
          </div>
          {searchStatus === 'loading' ? (
            <Skeleton count={1} height={50} />
          ) : (
            userSearchResults.length > 0 ? (
              userSearchResults.map(user => (
                <div key={user.id} className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 flex flex-col sm:flex-row justify-between items-center sm:text-left mb-4">
                  <div className="flex flex-col">
                    <h4 className="mb-2 text-sm sm:text-base">Name: <strong>{user.name}</strong></h4>
                    <p className="mb-2 text-sm sm:text-base">IC Number: <strong>{user.icno}</strong></p>
                  </div>
                  <button
                    className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 text-sm sm:text-base"
                    onClick={() => handleShowPurchaseModal(user)}
                  >
                    Add Purchase Record
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center">
                <img src={noDataImage} alt="No data" className="w-64 h-64" />
                <p className="text-gray-500 mt-4">No users found.</p>
              </div>
            )
          )}
        </div>
      )}

      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        prescriptions={Array.isArray(prescriptions.prescriptions) ? prescriptions.prescriptions : []}
        onCreatePurchase={handleCreatePurchase}
        userId={selectedAppointment?.user?.id || 0}
        pharmacistId={user_info.id}
      />

      {selectedUser && (
        <PurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          user={selectedUser}
          medications={medications}
          onCreatePurchase={handleCreatePurchase}
          pharmacistId={user_info.id}
        />
      )}
    </div>
  );
}
