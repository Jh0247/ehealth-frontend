import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAppointmentDetails, deleteAppointment, updateAppointmentWithPrescriptions, cancelAppointment } from '../../redux/features/appointmentSlice';
import { fetchMedications } from '../../redux/features/medicationSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Icon } from '@iconify/react';
import deleteIcon from '@iconify-icons/mdi/delete';
import plusIcon from '@iconify-icons/mdi/plus';
import arrowBackIcon from '@iconify-icons/mdi/arrow-left';
import JitsiMeeting from '../../components/JitsiMeeting';
import PrescriptionField from './PrescriptionField';
import { rolePathMap } from '../../constants/rolePath';
import { popToast, ToastType } from '../../redux/features/toastSlice';

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
  const { medications } = useSelector((state) => state.medication);
  const { user_info } = useSelector((state) => state.user);

  const { appointmentId } = location.state || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([{ medication_id: '', dosage: '', dosageUnit: '', frequency: '', duration: '', durationUnit: '' }]);
  const [showPrescriptionFields, setShowPrescriptionFields] = useState(false);
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (appointmentId) {
      dispatch(getAppointmentDetails(appointmentId));
      dispatch(fetchMedications());
    } else {
      navigate(rolePathMap[user_info?.user_role]+'/appointment-list');
    }
  }, [dispatch, appointmentId, navigate, user_info]);

  useEffect(() => {
    if (appointment) {
      setPrescriptions(appointment.prescriptions || []);
      setDuration(appointment.duration ? String(appointment.duration) : '');
      setNote(appointment.note || '');
    }
  }, [appointment]);

  const handleDelete = () => {
    dispatch(deleteAppointment(appointmentId)).then((action) => {
      if (action.type === deleteAppointment.fulfilled.toString()) {
        navigate(rolePathMap[user_info?.user_role]+'/appointment-list');
      }
    });
  };

  const handleCancel = () => {
    dispatch(cancelAppointment(appointmentId)).then((action) => {
      if (action.type === cancelAppointment.fulfilled.toString()) {
        navigate(rolePathMap[user_info?.user_role]+'/appointment-list');
      }
    });
  };

  const handleAddPrescription = () => {
    setPrescriptions([...prescriptions, { medication_id: '', dosage: '', frequency: '', duration: '' }]);
    setShowPrescriptionFields(true);
  };

  const handleRemovePrescription = (index) => {
    const newPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(newPrescriptions);
  };

  const handlePrescriptionChange = (index, field, value) => {
    console.log(`Changing prescription at index ${index}, field ${field}, value ${value}`);
    const newPrescriptions = prescriptions.map((prescription, i) => {
      if (i === index) {
        return { ...prescription, [field]: value };
      }
      return prescription;
    });
    setPrescriptions(newPrescriptions);
    console.log('Updated prescriptions:', newPrescriptions);
  };
  
  
  const handleComplete = () => {
    console.log('Prescriptions:', prescriptions);
  
    const allPrescriptionsFilled = prescriptions.every(prescription => 
      prescription.medication_id && 
      prescription.dosage && 
      prescription.dosageUnit && 
      prescription.frequency && 
      prescription.duration && 
      prescription.durationUnit
    );
  
    if (!duration || !note || !allPrescriptionsFilled) {
      console.warn('Duration:', duration);
      console.warn('Note:', note);
      console.warn('All Prescriptions Filled:', allPrescriptionsFilled);
      console.warn('Prescriptions Details:', prescriptions);
  
      dispatch(popToast({
        title: 'Error',
        message: 'Please fill in all the fields.',
        type: ToastType.ERROR,
      }));
      return;
    }
  
    const updateData = {
      duration: parseInt(duration, 10),
      note,
      prescriptions: prescriptions.map(prescription => ({
        medication_id: prescription.medication_id,
        dosage: (prescription.dosage +' '+ prescription.dosageUnit),
        frequency: prescription.frequency,
        duration: prescription.duration,
        durationUnit: prescription.durationUnit,
      })),
    };
  
    console.log('Update data:', updateData);
  
    dispatch(updateAppointmentWithPrescriptions({ appointmentId, data: updateData })).then((action) => {
      if (action.type === updateAppointmentWithPrescriptions.fulfilled.toString()) {
        navigate(rolePathMap[user_info?.user_role] + '/appointment-list');
      }
    });
  };
  
  
  if (status === 'loading' || !appointment) {
    return <Skeleton count={5} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const isCompleted = appointment.status === 'completed';

  const formatAllergies = (allergies) => {
    if (!allergies) return "None";
    if (allergies === '["None"]') return "None";
    const parsedAllergies = JSON.parse(allergies);
    const formattedAllergies = Object.entries(parsedAllergies)
      .map(([key, value]) => (
        <div className="mt-2" key={key}>
          <strong>{key}:</strong> {value?.join(", ")}
        </div>
      ));
    return formattedAllergies;
  };

  return (
    <div className="flex flex-col p-5 md:p-9">
      <button 
        onClick={() => navigate(-1)}
        className="text-blue-500 underline flex items-center mb-4"
      >
        <Icon icon={arrowBackIcon} className="w-5 h-5 mr-2" />
        Back
      </button>
      <div className="flex flex-row justify-between items-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold">Appointment Details</h3>
        {!isCompleted && appointment.status === 'pending' && user_info?.user_role === 'user' && (
          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded"
            >
              <Icon icon={deleteIcon} className="w-5 h-5 sm:mr-2" />
              <p className="hidden sm:block">Cancel</p>
            </button>
          </div>
        )}
        {appointment.status === 'pending' && user_info?.user_role === 'admin' && (
          <div className="flex justify-end">
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded"
            >
              <Icon icon={deleteIcon} className="w-5 h-5 sm:mr-2" />
              <p className="hidden sm:block">Cancel Appointment</p>
            </button>
          </div>
        )}
      </div>
      <div className="bg-white rounded shadow-md shadow-teal-800 p-4 md:p-6">
        <div className="mb-4">
          <h4 className="font-bold">Appointment Information</h4>
          <p className="capitalize mt-2"><strong>Date & Time:</strong> {new Date(appointment?.appointment_datetime).toLocaleString('en-GB')}</p>
          <p className="capitalize mt-2"><strong>Type:</strong> {appointment?.type}</p>
          <p className="mt-2"><strong>Purpose:</strong> {appointment?.purpose}</p>
          <p className="capitalize mt-2"><strong>Status:</strong> {appointment?.status}</p>
        </div>
        <hr></hr>
        <div className="my-4">
          <h4 className="font-bold">Patient Information</h4>
          <p className="mt-2"><strong>Name: </strong>
            <span 
              onClick={() => navigate(`${rolePathMap[user_info?.user_role]}/health-record`, { state: { userId: appointment?.user?.id } })}
              className="mt-2 text-blue-500 underline cursor-pointer"
            >
              {appointment?.user?.name}
            </span>
          </p>
          <p className="mt-2"><strong>Email: </strong>
            <a
              href={`mailto:${appointment?.user?.email}`}
              className="mt-2 text-blue-500 underline cursor-pointer"
            >
              {appointment?.user?.email}
            </a>
          </p>
          <p className="mt-2"><strong>Contact: </strong>
            <a
              href={`tel:${appointment?.user?.contact}`}
              className="mt-2 text-blue-500 underline cursor-pointer"
            >
              {appointment?.user?.contact}
            </a>
          </p>
          <p className="mt-2"><strong>Blood Type:</strong> {appointment?.user?.health_record?.blood_type}</p>
          <p className="mt-2"><strong>Allergic:</strong> {formatAllergies(appointment?.user?.health_record?.allergic)}</p>
          <p className="mt-2"><strong>Diseases:</strong> {appointment?.user?.health_record?.diseases !== 'null' ? appointment?.user?.health_record?.diseases : 'None'}</p>
        </div>
        <hr></hr>
        <div className="my-4">
          <h4 className="font-bold">Doctor Information</h4>
          <p className="mt-2"><strong>Name:</strong> {appointment?.doctor?.name}</p>
          <p className="mt-2"><strong>Email: </strong>
            <a
              href={`mailto:${appointment?.doctor?.email}`}
              className="mt-2 text-blue-500 underline cursor-pointer"
            >
              {appointment?.doctor?.email}
            </a>
          </p>
          <p className="mt-2"><strong>Contact: </strong>
            <a
              href={`tel:${appointment?.doctor?.contact}`}
              className="mt-2 text-blue-500 underline cursor-pointer"
            >
              {appointment?.doctor?.contact}
            </a>
          </p>
        </div>
        <hr></hr>
        <div className="my-4">
          <h4 className="font-bold">Organization Information</h4>
          <p className="capitalize mt-2"><strong>Name:</strong> {appointment?.organization?.name}</p>
          <p className="mt-2"><strong>Location:</strong> {appointment?.organization?.address}</p>
        </div>
        <hr></hr>
        {appointment.type === 'virtual' && !isCompleted && (user_info?.user_role === 'doctor' || user_info?.user_role === 'user') && (
          <div className="mb-4">
            <h4 className="font-bold my-2">Virtual Meeting</h4>
            <JitsiMeeting
              roomName={`appointment_${appointment?.id}`}
              displayName={user_info?.name}
              email={appointment?.user?.email}
            />
          </div>
        )}
        {user_info?.user_role === 'doctor' && (
          <div className="mt-6">
            <div className="">
              <label className="block font-bold mb-2">Duration:</label>
              <select
                className="w-full p-2 border border-gray-300 rounded mb-2"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                disabled={isCompleted}
              >
                <option value="">Select duration</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
              </select>
              <label className="block font-bold mb-2">Note:</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded mb-2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note things on the appointment..."
                required
                disabled={isCompleted}
              />
            </div>
            {!isCompleted && (
              <>
                <h4 className="font-bold mb-2">Prescriptions</h4>
                <button
                  onClick={handleAddPrescription}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded mb-4"
                >
                  <Icon icon={plusIcon} className="w-5 h-5 mr-2" />
                  Add Prescription
                </button>
              </>
            )}
            {showPrescriptionFields && (
              <div>
                {prescriptions.map((prescription, index) => (
                  <PrescriptionField
                    key={index}
                    index={index}
                    medications={medications}
                    formData={prescription}
                    handleChange={handlePrescriptionChange}
                    handleRemove={handleRemovePrescription}
                    isEditable={!isCompleted}
                  />
                ))}
                {!isCompleted && (
                  <div className="mt-4">
                    <button
                      onClick={handleComplete}
                      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded mt-4"
                    >
                      Complete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {isCompleted && (
          <div className="mt-6">
            <h4 className="font-bold mb-2">Prescriptions</h4>
            <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-4 gap-4 w-full p-2 bg-slate-100">
              <span className="font-bold border-r-2 border-gray-300">Name</span>
              <span className="font-bold border-r-2 border-gray-300 hidden sm:block">Dosage</span>
              <span className="font-bold border-r-2 border-gray-300 hidden sm:block">Frequency</span>
              <span className="font-bold border-r-2 border-gray-300 hidden sm:block">Duration</span>
            </div>
            <div>
              {prescriptions.map((prescription, index) => (
                <PrescriptionField
                  key={index}
                  index={index}
                  medications={medications}
                  formData={prescription}
                  handleChange={handlePrescriptionChange}
                  handleRemove={handleRemovePrescription}
                  isEditable={false}
                />
              ))}
            </div>
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
