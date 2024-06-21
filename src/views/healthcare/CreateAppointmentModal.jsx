import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { searchUserByIcno, adminBookAppointment, clearUserSearchResults } from '../../redux/features/appointmentSlice';
import { popToast, ToastType } from '../../redux/features/toastSlice';

const CreateAppointmentModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { userSearchResults, status, error } = useSelector((state) => state.appointment);
  const { staff } = useSelector((state) => state.healthcareProvider);
  const { user_info } = useSelector((state) => state.user);

  const [icno, setIcno] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    doctor_id: '',
    appointment_datetime: '',
    type: '',
    purpose: '',
  });

  useEffect(() => {
    if (icno) {
      const delayDebounceFn = setTimeout(() => {
        dispatch(searchUserByIcno(icno));
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [icno, dispatch]);

  const handleIcnoChange = (e) => {
    setIcno(e.target.value);
  };

  const handleUserSelect = (userId) => {
    const user = userSearchResults.find((u) => u.id === parseInt(userId));
    setSelectedUser(user);
    setIcno(user?.icno);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData({ ...appointmentData, [name]: value });
  };

  const handleDateChange = (e) => {
    setAppointmentData({ ...appointmentData, appointment_datetime: e.target.value });
  };

  const handleSubmit = () => {
    if (!selectedUser || !appointmentData.doctor_id || !appointmentData.appointment_datetime || !appointmentData.type || !appointmentData.purpose) {
      dispatch(popToast({
        title: 'Error',
        message: 'Please fill in all fields.',
        type: ToastType.ERROR,
      }));
      return;
    }

    const selectedDate = new Date(appointmentData.appointment_datetime);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      dispatch(popToast({
        title: 'Error',
        message: 'Cannot book an appointment in the past.',
        type: ToastType.ERROR,
      }));
      return;
    }

    const data = {
      ...appointmentData,
      user_id: selectedUser.id,
      organization_id: user_info.organization_id,
    };
    dispatch(adminBookAppointment(data)).then((action) => {
      if (action.type === adminBookAppointment.fulfilled.toString()) {
        dispatch(clearUserSearchResults()); 
        onClose();
      }
    });
  };

  const handleClose = () => {
    dispatch(clearUserSearchResults());
    onClose();
  };

  const doctors = staff.filter((member) => member.user_role === 'doctor');

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full mx-2">
        <h3 className="text-lg font-bold mb-4">Create Appointment</h3>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by IC Number"
            value={icno}
            onChange={handleIcnoChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          {status === 'loading' && <p>Loading...</p>}
          {status === 'failed' && <p className="text-red-500 mb-2">{error}</p>}
          {userSearchResults && (
            <select
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => handleUserSelect(e.target.value)}
            >
              <option value="">Select a user</option>
              {userSearchResults.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.icno}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="mb-4">
          <select
            className="w-full p-2 border border-gray-300 rounded"
            name="doctor_id"
            value={appointmentData.doctor_id}
            onChange={handleInputChange}
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <input
            type="datetime-local"
            placeholder="Select Date and Time"
            value={appointmentData.appointment_datetime}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
        </div>
        <div className="mb-4">
          <select
            className="w-full p-2 border border-gray-300 rounded"
            name="type"
            value={appointmentData.type}
            onChange={handleInputChange}
          >
            <option value="">Select Type</option>
            <option value="physical">Physical</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Purpose"
            name="purpose"
            value={appointmentData.purpose}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button onClick={handleClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Create Appointment</button>
        </div>
      </div>
    </div>
  ) : null;
};

CreateAppointmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateAppointmentModal;
