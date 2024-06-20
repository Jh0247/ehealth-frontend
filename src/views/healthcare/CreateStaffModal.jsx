import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { registerStaff } from '../../redux/features/healthcareProviderSlice';

const CreateStaffModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.healthcareProvider);
  const { user_info } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    icno: '',
    contact: '',
    password: '',
    password_confirmation: '',
    user_role: 'doctor',
  });

  useEffect(() => {
    if (user_info?.organization_id) {
      setFormData((prevData) => ({ ...prevData, organization_id: user_info.organization_id }));
    }
  }, [user_info]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      status: 'active',
      organization_id: user_info.organization_id,
    };
    dispatch(registerStaff(dataToSubmit)).then((response) => {
      if (response.meta.requestStatus !== 'rejected') {
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-11/12 max-w-lg">
        <h2 className="text-xl font-bold mb-4">Register Staff</h2>
        {error && <p className="text-red-500 mb-4">{error.error || 'An error occurred'}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">IC Number</label>
            <input
              type="text"
              name="icno"
              value={formData.icno}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              name="user_role"
              value={formData.user_role}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            >
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CreateStaffModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateStaffModal;
