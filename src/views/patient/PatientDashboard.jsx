import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import defaultImage from '../../assets/default.jpg';
import emailIcon from '@iconify-icons/mdi/email';
import phoneIcon from '@iconify-icons/mdi/phone';
import healthIcon from '@iconify-icons/mdi/account-heart';
import editIcon from '@iconify-icons/mdi/pencil-outline';
import checkIcon from '@iconify-icons/mdi/check';
import clockIcon from '@iconify-icons/mdi/clock';
import cancelIcon from '@iconify-icons/mdi/cancel';
import noDataImage from '../../assets/noData.png';
import noMedicationImage from '../../assets/noMedication.png';
import { getUserHealth, getUserAppointments, getUserMedications } from '../../redux/features/userSlice';
import { fetchMedicationDetails } from '../../redux/features/medicationSlice';
import ProfileUpdateModal from '../shared/ProfileUpdateModal';
import MedicationDetailsModal from '../shared/MedicationDetailsModal';

export default function PatientDashboard() {
  const dispatch = useDispatch();
  const { user_info, health_record, appointments, medications, status } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medicationModalOpen, setMedicationModalOpen] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserHealth());
    dispatch(getUserAppointments());
    dispatch(getUserMedications());
  }, [dispatch]);

  const handleViewDetails = (id) => {
    setSelectedMedicationId(id);
    dispatch(fetchMedicationDetails(id)).then(() => {
      setMedicationModalOpen(true);
    });
  };

  return (
    <div className="flex flex-col p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6">Dashboard</h3>
      {/* Profile Card */}
      <div className="bg-white rounded shadow-md shadow-teal-800 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center relative">
        <div className="flex items-center flex-col md:flex-row">
          {status === 'loading' ? (
            <Skeleton circle={true} height={144} width={144} className="my-2 md:my-0 md:mr-9" />
          ) : (
            <img
              src={user_info?.profile_img || defaultImage}
              alt="Profile"
              className={"w-36 h-36 rounded-full my-2 md:my-0 md:mr-9 border object-cover"}
            />
          )}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold my-2">
              {status === 'loading' ? <Skeleton width={120} /> : user_info?.name}
            </h2>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={emailIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={180} /> : user_info?.email}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={phoneIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={120} /> : user_info?.contact}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={healthIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={60} /> : (health_record?.health_condition || 'N/A')}
            </p>
          </div>
        </div>
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={() => setIsModalOpen(true)}
        >
          <Icon icon={editIcon} className="w-6 h-6" />
        </button>
      </div>
      {/* Book Consultation */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-3">Seek for Consultation</h3>
        <Link to="/user/book-appointment">
          <button className="bg-[#347576] hover:bg-[#285D5E] text-white py-2 px-4 rounded w-full">
            Book Appointment
          </button>
        </Link>
      </div>
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
        {/* Consultation History */}
        <div className="my-8">
          <h3 className="text-lg font-bold">Consultation History</h3>
          <div className="bg-white p-4 rounded-lg shadow-sm shadow-teal-800 my-4 max-h-52 overflow-y-auto min-h-[200px]">
            <ul>
              {status === 'loading' ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <li key={index} className="flex justify-between items-center border-b py-2">
                    <Skeleton width={200} height={20} />
                  </li>
                ))
              ) : (
                Array.isArray(appointments) && appointments.length > 0 ? (
                  appointments.map((appointment, index) => (
                    <li 
                      key={index} 
                      className="flex justify-between items-center border-b py-2 cursor-pointer" 
                      onClick={() => navigate('/user/appointment-details', { state: { appointmentId: appointment.id } })}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm">
                          <strong>Date:</strong> {new Date(appointment?.appointment_datetime).toLocaleDateString()}, {new Date(appointment?.appointment_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-sm">
                          <strong>Type:</strong> {appointment?.type}
                        </span>
                      </div>
                      <span className="text-sm flex items-center">
                        {appointment?.status === 'pending' && (
                          <>
                            <Icon icon={clockIcon} className="block md:hidden w-5 h-5 text-yellow-600" />
                            <span className="hidden md:inline-block ml-2 bg-yellow-200 text-yellow-800 py-1 px-3 rounded-full">Pending</span>
                          </>
                        )}
                        {appointment?.status === 'cancelled' && (
                          <>
                            <Icon icon={cancelIcon} className="block md:hidden w-5 h-5 text-red-600" />
                            <span className="hidden md:inline-block ml-2 bg-red-200 text-red-800 py-1 px-3 rounded-full">Cancelled</span>
                          </>
                        )}
                        {appointment?.status === 'completed' && (
                          <>
                            <Icon icon={checkIcon} className="block md:hidden w-5 h-5 text-green-600" />
                            <span className="hidden md:inline-block ml-2 bg-green-200 text-green-800 py-1 px-3 rounded-full">Completed</span>
                          </>
                        )}
                      </span>
                    </li>
                  ))
                ) : (
                  <div className="flex flex-col items-center">
                    <img src={noDataImage} alt="No Appointments Found" className="w-32 h-32" />
                    <span className="text-center text-gray-500 py-2">No Appointments Found</span>
                  </div>
                )
              )}
            </ul>
          </div>
        </div>
        {/* Medication Reminder */}
        <div className="mb-8 md:my-8">
          <h3 className="text-lg font-bold">Medication Reminder</h3>
          <div className="bg-white p-4 rounded-lg shadow-sm shadow-teal-800 my-4 max-h-52 overflow-y-auto min-h-[200px]">
            <ul>
              {status === 'loading' ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <li key={index} className="flex justify-between items-center border-b py-2">
                    <Skeleton width={200} height={20} />
                  </li>
                ))
              ) : (
                Array.isArray(medications) && medications.length > 0 ? (
                  medications.map((medication, index) => (
                    <li onClick={() => handleViewDetails(medication?.medication_id)} key={index} className="flex justify-between items-center border-b py-2">
                      <div className="flex flex-col">
                        <span className="text-sm"><strong>{medication?.medication_name}</strong></span>
                        <span className="text-sm">Start on: <strong>{medication?.start_date}</strong></span>
                        <span className="text-sm">End on: <strong>{medication?.end_date}</strong></span>
                      </div>
                      <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded">{medication?.dosage}</button>
                    </li>
                  ))
                ) : (
                  <div className="flex flex-col items-center">
                    <img src={noMedicationImage} alt="No Medications Found" className="w-32 h-32" />
                    <span className="text-center text-gray-500 py-2">No Medications Found</span>
                  </div>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
      <MedicationDetailsModal
        isOpen={medicationModalOpen}
        onClose={() => setMedicationModalOpen(false)}
      />
      <ProfileUpdateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
