import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAppointments } from '../../redux/features/userSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import noDataImage from '../../assets/noData.png';
import { Icon } from '@iconify/react';
import checkIcon from '@iconify-icons/mdi/check';
import clockIcon from '@iconify-icons/mdi/clock';
import cancelIcon from '@iconify-icons/mdi/cancel';
import plusIcon from '@iconify-icons/mdi/plus';
import DatePicker from 'react-datepicker';
import { rolePathMap } from '../../constants/rolePath';
import 'react-datepicker/dist/react-datepicker.css';
import { getAppointmentsByOrganization } from '../../redux/features/healthcareProviderSlice';
import CreateAppointmentModal from '../healthcare/CreateAppointmentModal';

const AppointmentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user_info, appointments: userAppointments, status: userStatus} = useSelector((state) => state.user);
  const { appointments: adminAppointment, status: providerStatus,} = useSelector((state) => state.healthcareProvider);
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState('Last Month');
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAppointments = () => {
    if (user_info?.user_role === 'admin') {
      dispatch(getAppointmentsByOrganization(user_info.organization_id));
    } else {
      dispatch(getUserAppointments());
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [dispatch, user_info]);

  useEffect(() => {
    if (user_info?.user_role === 'admin' || user_info?.user_role === 'nurse') {
      setAppointments(adminAppointment?.data);
      setStatus(providerStatus);
    } else {
      setAppointments(userAppointments);
      setStatus(userStatus);
    }
  }, [user_info, userAppointments, adminAppointment, userStatus, providerStatus])

  useEffect(() => {
    const filterAppointments = () => {
      let filtered = appointments.filter(app => app.status === 'completed' || app.status === 'cancelled');
      if (filter === 'Last Month') {
        filtered = filtered.filter(app => new Date(app.appointment_datetime) >= new Date(new Date().setMonth(new Date().getMonth() - 1)));
      } else if (filter === 'Last 6 Months') {
        filtered = filtered.filter(app => new Date(app.appointment_datetime) >= new Date(new Date().setMonth(new Date().getMonth() - 6)));
      } else if (filter === 'Last Year') {
        filtered = filtered.filter(app => new Date(app.appointment_datetime) >= new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
      } else if (filter === 'All') {
        filtered = appointments.filter(app => app.status === 'completed' || app.status === 'cancelled');
      } else {
        filtered = filtered.filter(app => new Date(app.appointment_datetime) >= startDate && new Date(app.appointment_datetime) <= endDate);
      }
      setFilteredAppointments(filtered);
    };

    filterAppointments();
  }, [appointments, filter, startDate, endDate]);

  const upcomingAppointments = appointments.filter(app => app.status === 'pending');

  const renderAppointment = (appointment, index) => (
    <li
      key={index} 
      className="flex justify-between items-center border-b py-2"
      onClick={() => navigate(rolePathMap[user_info?.user_role]+'/appointment-details', { state: { appointmentId: appointment.id } })}
    >
      <div className="flex w-full">
        <div className="flex flex-col w-3/4 sm:w-1/4 border-r-2 border-gray-300 pr-2">
          <span className="text-sm my-1 md:my-0">
            <strong>Date:</strong> {new Date(appointment?.appointment_datetime).toLocaleDateString('en-GB')}
          </span>
          <span className="text-sm my-1">
            <strong>Time:</strong> {new Date(appointment?.appointment_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="hidden sm:flex flex-col w-1/4 border-r-2 border-gray-300 px-2">
          <span className="text-sm my-1 md:my-0 capitalize">
            {appointment?.type}
          </span>
        </div>
        <div className="hidden sm:flex flex-col w-1/4 border-r-2 border-gray-300 px-2">
          <span className="text-sm my-1 md:my-0">
            {appointment?.purpose}
          </span>
        </div>
        <div className="flex w-1/4 items-center px-2">
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
        </div>
      </div>
    </li>
  );

  return (
    <div className="flex flex-col p-5 md:p-9">
      <div className="flex flex-row justify-between items-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold">Appointment</h3>
        {user_info?.user_role === 'user' && (
          <Link to="/user/book-appointment">
            <button className="hidden sm:block bg-[#347576] hover:bg-[#285D5E] text-white py-2 px-4 rounded">
              Book Appointment
            </button>
            <button className="block sm:hidden bg-[#347576] hover:bg-[#285D5E] text-white py-2 px-4 rounded">
              <Icon icon={plusIcon} className="w-5 h-5" />
            </button>
          </Link>
        )}
        {user_info?.user_role === 'admin' && (
          <button
            className="hidden sm:block bg-[#347576] hover:bg-[#285D5E] text-white py-2 px-4 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Create Appointment
          </button>
        )}
      </div>
      <div className="bg-white rounded shadow-md shadow-teal-800 p-4 md:p-6">
        {upcomingAppointments.length > 0 && (
          <div className="mt-4">
            <h4 className="font-bold mb-2">Upcoming</h4>
            <div className="relative bg-gray-100 rounded-lg shadow-inner">
              <div className="sticky top-0 bg-gray-100 p-4 rounded-t-lg shadow-md">
                <div className="flex justify-between mb-2">
                  <div className="w-3/4 sm:w-1/4"><strong>Date & Time</strong></div>
                  <div className="hidden sm:block w-1/4"><strong>Type</strong></div>
                  <div className="hidden sm:block w-1/4"><strong>Purpose</strong></div>
                  <div className="w-1/4"><strong>Status</strong></div>
                </div>
              </div>
              <ul className="max-h-52 overflow-y-auto px-4 py-2">
                {status === 'loading' ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <li key={index} className="flex justify-between items-center border-b py-2">
                      <Skeleton width={200} height={20} />
                    </li>
                  ))
                ) : upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment, index) => renderAppointment(appointment, index))
                ) : null}
              </ul>
            </div>
          </div>
        )}
        <div className="mt-4">
          <div className="flex flex-row justify-between items-center">
            <h4 className="font-bold mb-2 block sm:hidden">Past</h4>
            <h4 className="font-bold mb-2 hidden sm:block">Past Appointment</h4>
            <div className="flex justify-between items-center mb-4">
              <select className="border p-2 rounded" onChange={(e) => setFilter(e.target.value)} value={filter}>
                <option>Last Month</option>
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>All</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          {filter === 'custom' && (
            <div className="flex flex-col sm:flex-row justify-end mb-5 gap-5">
              <div className="flex flex-col sm:flex-row p-4 sm:p-2 rounded-lg shadow-sm shadow-teal-800 items-center sm:gap-3 sm:w-fit">
                <span className="text-gray-900 py-1">Starting Date</span>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  className="border p-2 rounded max-w-[155px]"
                />
              </div>
              <div className="flex flex-col sm:flex-row p-4 sm:p-2 rounded-lg shadow-sm shadow-teal-800 items-center sm:gap-3 sm:w-fit">
                <span className="text-gray-900 py-1">Ending Date</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="dd/MM/yyyy"
                  className="border p-2 rounded max-w-[155px]"
                />
              </div>
            </div>
          )}
          <div className="relative bg-gray-100 rounded-lg shadow-inner">
            <div className="sticky top-0 bg-gray-100 p-4 rounded-t-lg shadow-md">
              <div className="flex justify-between mb-2">
                <div className="w-3/4 sm:w-1/4"><strong>Date & Time</strong></div>
                <div className="hidden sm:block w-1/4"><strong>Type</strong></div>
                <div className="hidden sm:block w-1/4"><strong>Purpose</strong></div>
                <div className="w-1/4"><strong>Status</strong></div>
              </div>
            </div>
            <ul className="max-h-52 overflow-y-auto p-4">
              {status === 'loading' ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <li key={index} className="flex justify-between items-center border-b py-2">
                    <Skeleton width={200} height={20} />
                  </li>
                ))
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment, index) => renderAppointment(appointment, index))
              ) : (
                <div className="flex flex-col items-center">
                  <img src={noDataImage} alt="No Appointments Found" className="w-32 h-32" />
                  <span className="text-center text-gray-500 py-2">No Past Appointments Found</span>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
      <CreateAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchAppointments(); // Refetch appointments after closing modal
        }} 
      />
    </div>
  );
};

export default AppointmentList;
