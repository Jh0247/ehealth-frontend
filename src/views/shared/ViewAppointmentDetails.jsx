import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAppointmentDetails, deleteAppointment } from '../../redux/features/appointmentSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Icon } from '@iconify/react';
import editIcon from '@iconify-icons/mdi/pencil';
import deleteIcon from '@iconify-icons/mdi/delete';
import arrowBackIcon from '@iconify-icons/mdi/arrow-left';
import JitsiMeeting from '../../components/JitsiMeeting';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
        <p className="mb-6">Are you sure you want to delete this appointment?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

const ViewAppointmentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appointment, status, error } = useSelector((state) => state.appointment);

  const { appointmentId } = location.state || {};
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      dispatch(getAppointmentDetails(appointmentId));
    } else {
      navigate('/user/appointment-list');
    }
  }, [dispatch, appointmentId, navigate]);

  const handleDelete = () => {
    dispatch(deleteAppointment(appointmentId)).then((action) => {
      if (action.type === deleteAppointment.fulfilled.toString()) {
        navigate('/user/appointment-list');
      }
    });
  };

  const handleEdit = () => {
    console.log('Edit appointment');
    // navigate to edit page or open edit modal
  };

  if (status === 'loading' || !appointment) {
    return <Skeleton count={5} />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col p-5 md:p-9">
      <button 
        onClick={() => navigate(-1)}
        className="text-blue-500 underline flex items-center mb-4"
      >
        <Icon icon={arrowBackIcon} className="w-5 h-5 mr-2" />
        Back
      </button>

      <h3 className="text-xl md:text-2xl font-bold mb-6">Appointment Details</h3>
      <div className="bg-white rounded shadow-md shadow-teal-800 p-4 md:p-6">
        <div className="mb-4">
          <h4 className="font-bold mb-2">Appointment Information</h4>
          <p><strong>Date & Time:</strong> {new Date(appointment.appointment_datetime).toLocaleString('en-GB')}</p>
          <p><strong>Type:</strong> {appointment.type}</p>
          <p><strong>Purpose:</strong> {appointment.purpose}</p>
          <p><strong>Status:</strong> {appointment.status === 'pending' ? 'Pending' : appointment.status}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-bold mb-2">Doctor Information</h4>
          <p><strong>Name:</strong> {appointment.doctor.name}</p>
          <p><strong>Email:</strong> {appointment.doctor.email}</p>
          <p><strong>Contact:</strong> {appointment.doctor.contact}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-bold mb-2">Organization Information</h4>
          <p><strong>Name:</strong> {appointment.organization.name}</p>
          <p><strong>Location:</strong> {appointment.organization.locations[0].address}</p>
        </div>
        {appointment.type === 'virtual' && (
          <div className="mb-4">
            <h4 className="font-bold mb-2">Virtual Meeting</h4>
            <JitsiMeeting
              roomName={`appointment_${appointment.id}`}
              displayName={appointment.user.name}
              email={appointment.user.email}
            />
          </div>
        )}
        {appointment.status === 'pending' && (
          <div className="flex justify-end gap-2">
            <button onClick={handleEdit} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded">
              <Icon icon={editIcon} className="w-5 h-5 mr-2" />
              Edit
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded"
            >
              <Icon icon={deleteIcon} className="w-5 h-5 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ViewAppointmentDetails;
