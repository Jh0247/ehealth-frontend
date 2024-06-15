import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import bookingSuccess from '../../assets/bookingSuccess.png';
import { getOrganizationList, getOrganizationDetails, getUsersByOrganization } from '../../redux/features/organizationSlice';
import { bookAppointment, resetState } from '../../redux/features/appointmentSlice';

const StepIndicator = ({ step }) => {
  const steps = [
    { number: 1, label: 'Schedule' },
    { number: 2, label: 'Details' },
    { number: 3, label: 'Completed' },
  ];

  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map((s, index) => (
        <React.Fragment key={s.number}>
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= s.number ? 'bg-[#347576] text-white' : 'bg-gray-200 text-gray-700'}`}>
            {s.number}
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 ${step > s.number ? 'bg-[#347576]' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

StepIndicator.propTypes = {
  step: PropTypes.number.isRequired,
};

const Step1 = ({ formData, handleChange, handleNext }) => {
  const isStep1Valid = formData.service && formData.date && formData.time;

  return (
    <div>
      <div className="mb-4">
        <label className="block mb-2 font-bold text-md">Type of Consultation:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded bg-white"
          value={formData.service}
          onChange={handleChange('service')}
        >
          <option disabled value="">Please Select</option>
          <option value="virtual">Virtual</option>
          <option value="physical">Physical</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold text-md">Select Date:</label>
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded"
          value={formData.date}
          onChange={handleChange('date')}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold text-md">Select Time:</label>
        <input
          type="time"
          className="w-full p-2 border border-gray-300 rounded"
          value={formData.time}
          onChange={handleChange('time')}
        />
      </div>
      <button
        onClick={handleNext}
        className={`px-4 py-2 rounded ${isStep1Valid ? 'bg-[#347576] text-white' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
        disabled={!isStep1Valid}
      >
        Next
      </button>
    </div>
  );
};

Step1.propTypes = {
  formData: PropTypes.shape({
    service: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

const Step2 = ({ formData, setFormData, handleChange, handleNext, handlePrevious, organizations, locations, doctors }) => {
  const dispatch = useDispatch();

  const handleOrganizationChange = (e) => {
    const organizationId = e.target.value;
    handleChange('organization')(e);
    dispatch(getOrganizationDetails(organizationId));
    dispatch(getUsersByOrganization({ organizationId, role: 'doctor' }));
    // Reset location and doctor when organization changes
    setFormData((prevData) => ({
      ...prevData,
      location: '',
      doctor: '',
    }));
  };

  const isStep2Valid = formData.organization && formData.location && formData.doctor && formData.purpose;

  return (
    <div>
      <div className="mb-4">
        <label className="block mb-2 font-bold text-md">Please Select Organization:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded bg-white"
          value={formData.organization}
          onChange={handleOrganizationChange}
        >
          <option value="">Select Organization</option>
          {organizations?.map((org) => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold text-md">Location:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded bg-white max-w-full"
          value={formData.location}
          onChange={handleChange('location')}
        >
          <option value="">Select Location</option>
          {locations?.map((loc) => (
            <option key={loc.id} value={loc.id}>{loc.address}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold text-md">Purpose:</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          value={formData.purpose}
          onChange={handleChange('purpose')}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold text-md">Doctor:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded bg-white max-w-full"
          value={formData.doctor}
          onChange={handleChange('doctor')}
        >
          <option value="">Select Doctor</option>
          {doctors?.map((doc) => (
            <option key={doc.id} value={doc.id}>{doc.name}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <button onClick={handlePrevious} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">
          Previous
        </button>
        <button
          onClick={handleNext}
          className={`px-4 py-2 rounded ${isStep2Valid ? 'bg-[#347576] text-white' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
          disabled={!isStep2Valid}
        >
          Next
        </button>
      </div>
    </div>
  );
};

Step2.propTypes = {
  formData: PropTypes.shape({
    organization: PropTypes.string,
    location: PropTypes.string,
    doctor: PropTypes.string,
    purpose: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handlePrevious: PropTypes.func.isRequired,
  organizations: PropTypes.arrayOf(PropTypes.object).isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  doctors: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const Step3 = ({ handlePrevious }) => (
  <div className="text-center">
    <img src={bookingSuccess} alt="Success" className="mx-auto mb-4" />
    <h2 className="text-xl font-bold mb-4">Successfully Booked !!</h2>
    <button onClick={handlePrevious} className="px-4 py-2 bg-[#347576] text-white rounded">
      Home
    </button>
  </div>
);

Step3.propTypes = {
  handlePrevious: PropTypes.func.isRequired,
};

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    doctor: '',
    date: '',
    time: '',
    organization: '',
    location: '',
    purpose: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { organizations, locations, users: doctors } = useSelector((state) => state.organization);

  useEffect(() => {
    dispatch(getOrganizationList());
  }, [dispatch]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleNext = () => {
    if (step === 2) {
      const appointmentData = {
        doctor_id: formData.doctor,
        organization_id: formData.organization,
        appointment_datetime: `${formData.date} ${formData.time}:00`,
        type: formData.service,
        purpose: formData.purpose,
      };
      dispatch(bookAppointment(appointmentData)).then((action) => {
        if (action.type === bookAppointment.fulfilled.toString()) {
          setStep(3);
          dispatch(resetState());
        }
      });
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleHome = () => {
    navigate('/user/appointment-list');
  };

  return (
    <div className="flex flex-col p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6">Book Appointment</h3>
      <StepIndicator step={step} />
      <div className="w-full bg-white rounded shadow-sm shadow-teal-800 p-4">
        <div className="my-2">
          {step === 1 && <Step1 formData={formData} handleChange={handleChange} handleNext={handleNext} />}
          {step === 2 && (
            <Step2
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              organizations={organizations}
              locations={locations}
              doctors={doctors}
            />
          )}
          {step === 3 && <Step3 handlePrevious={handleHome} />}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
