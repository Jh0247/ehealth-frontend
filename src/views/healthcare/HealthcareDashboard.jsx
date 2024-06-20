import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import defaultImage from '../../assets/default.jpg';
import noDataImage from '../../assets/noData.png';
import { rolePathMap } from '../../constants/rolePath';

import { getUserAppointments } from '../../redux/features/userSlice';
import { getPatientsByDoctor, getOrganizationStats, getAppointmentsByOrganization } from '../../redux/features/healthcareProviderSlice';

import ProfileUpdateModal from '../shared/ProfileUpdateModal';

import emailIcon from '@iconify-icons/mdi/email';
import phoneIcon from '@iconify-icons/mdi/phone';
import editIcon from '@iconify-icons/mdi/pencil-outline';
import checkIcon from '@iconify-icons/mdi/check';
import clockIcon from '@iconify-icons/mdi/clock';
import cancelIcon from '@iconify-icons/mdi/cancel';
import businessIcon from '@iconify-icons/mdi/business';
import accountIcon from '@iconify-icons/mdi/account';

export default function HealthcareDashboard() {
  const dispatch = useDispatch();
  const { user_info, status: userStatus, appointments: doctorAppointment} = useSelector((state) => state.user);
  const { patients, statistics, status: providerStatus, appointments: adminAppointment } = useSelector((state) => state.healthcareProvider);
  const [appointmentData, setAppointmentData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user_info?.user_role === 'doctor') {
      dispatch(getUserAppointments());
      dispatch(getPatientsByDoctor());
    } else if (user_info?.user_role === 'admin') {
      dispatch(getOrganizationStats(user_info.organization_id));
      dispatch(getAppointmentsByOrganization(user_info.organization_id));
    }
  }, [dispatch, user_info]);

  useEffect(() => {
    if (user_info?.user_role === 'doctor') {
      setAppointmentData(doctorAppointment);
    } else if(user_info?.user_role === 'admin') {
      setAppointmentData(adminAppointment?.data);
    }
  }, [user_info, doctorAppointment, adminAppointment])

  return (
    <div className="flex flex-col p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6">Dashboard</h3>
      {/* Profile Card */}
      <div className="bg-white rounded shadow-md shadow-teal-800 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center relative">
        <div className="flex items-center flex-col md:flex-row">
          {userStatus === 'loading' ? (
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
              {userStatus === 'loading' ? <Skeleton width={120} /> : user_info?.name}
            </h2>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={emailIcon} className="w-5 h-5 mr-2" />
              {userStatus === 'loading' ? <Skeleton width={180} /> : user_info?.email}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={phoneIcon} className="w-5 h-5 mr-2" />
              {userStatus === 'loading' ? <Skeleton width={120} /> : user_info?.contact}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={businessIcon} className="w-5 h-5 mr-2" />
              {userStatus === 'loading' ? <Skeleton width={120} /> : user_info?.organization?.name}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={accountIcon} className="w-5 h-5 mr-2" />
              {userStatus === 'loading' ? <Skeleton width={120} /> : user_info?.user_role}
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
      <div className="flex flex-col md:flex-row md:gap-6">
        {/* My Patients */}
        {user_info?.user_role === 'doctor' && (
          <div className="mt-8 w-full">
            <h3 className="text-md sm:text-lg font-bold mb-3">My Patients</h3>
            <div className="bg-white p-4 rounded-lg shadow-sm shadow-teal-800 my-4 max-h-52 overflow-y-auto min-h-[300px]">
              <ul>
                {providerStatus === 'loading' ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <li key={index} className="flex justify-between items-center border-b py-2">
                      <Skeleton width={200} height={20} />
                    </li>
                  ))
                ) : (
                  Array.isArray(patients) && patients.length > 0 ? (
                    patients.map((patient, index) => (
                      <li 
                        key={index} 
                        className="flex justify-between items-center border-b py-2"
                        onClick={() => navigate(`${rolePathMap[user_info?.user_role]}/health-record`, { state: { userId: patient.id } })}
                      >
                        <div className="flex items-center">
                          <img
                            src={patient.profile_img || defaultImage}
                            alt={patient.name}
                            className="w-12 h-12 rounded-full mr-4"
                          />
                          <div>
                            <h4 className="text-sm md:text-base font-semibold">{patient.name}</h4>
                            <p className="text-sm md:text-base text-gray-600"><strong>Tel : </strong>{patient.contact}</p>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="flex flex-col items-center">
                      <img src={noDataImage} alt="No Patients Found" className="w-32 h-32" />
                      <span className="text-center text-gray-500 py-2">No Patients Found</span>
                    </div>
                  )
                )}
              </ul>
            </div>
          </div>
        )}
        {/* Statistics Cards for Admin */}
        {user_info?.user_role === 'admin' && (
          <div className="flex flex-col gap-6 mt-8 sm:w-1/4">
            <h3 className="text-lg font-bold">Statistic</h3>
            <div className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 flex flex-col items-center text-center">
              <h4 className="text-lg mb-2">Number of Staffs</h4>
              <p className="text-3xl font-bold">{statistics?.num_staffs || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 flex flex-col items-center text-center">
              <h4 className="text-lg mb-2">Number of Appointments</h4>
              <p className="text-3xl font-bold">{statistics?.num_appointments || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 flex flex-col items-center text-center">
              <h4 className="text-lg mb-2">Number of Blogposts</h4>
              <p className="text-3xl font-bold">{statistics?.num_blogposts || 0}</p>
            </div>
          </div>
        )}
        {/* Appointments */}
        <div className="my-8 w-full">
          <h3 className="text-lg font-bold">Consultation History</h3>
          <div className="bg-white p-4 rounded-lg shadow-sm shadow-teal-800 my-4 max-h-52 overflow-y-auto min-h-[300px]">
            <ul>
              {providerStatus === 'loading' ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <li key={index} className="flex justify-between items-center border-b py-2">
                    <Skeleton width={200} height={20} />
                  </li>
                ))
              ) : (
                Array.isArray(appointmentData) && appointmentData.length > 0 ? (
                  appointmentData.map((appointment, index) => (
                    <li 
                      key={index} 
                      className="flex justify-between items-center border-b py-2 cursor-pointer" 
                      onClick={() => navigate('/healthcare/appointment-details', { state: { appointmentId: appointment.id } })}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm md:text-base mb-2">
                          <strong>Date:</strong> {new Date(appointment?.appointment_datetime).toLocaleDateString()}, {new Date(appointment?.appointment_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-sm md:text-base">
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
      </div>   
      <ProfileUpdateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
