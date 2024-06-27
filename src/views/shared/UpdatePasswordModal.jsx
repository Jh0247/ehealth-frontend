import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserPassword, resetUserStatus } from '../../redux/features/userSlice';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { popToast, ToastType } from '../../redux/features/toastSlice';

const UpdatePasswordModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { status, error, message } = useSelector((state) => state.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    evaluatePasswordStrength(value);
  };

  const evaluatePasswordStrength = (password) => {
    const lengthCriteria = password.length >= 8;
    const numberCriteria = /\d/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let strength = 0;
    if (password) strength += 1;
    if (lengthCriteria) strength += 1;
    if (numberCriteria) strength += 1;
    if (specialCharCriteria) strength += 1;

    setPasswordStrength(strength);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length >= 8 && newPassword === newPasswordConfirmation) {
      dispatch(updateUserPassword({ current_password: currentPassword, new_password: newPassword, new_password_confirmation: newPasswordConfirmation }));
    } else if (newPassword.length <= 7) {
      dispatch(
        popToast({
          title: 'Error',
          message: 'New password should more than 8 character.',
          type: ToastType.ERROR,
        })
      );
    } else if (newPassword !== newPasswordConfirmation) {
      dispatch(
        popToast({
          title: 'Error',
          message: 'New password does not match with confirmation password.',
          type: ToastType.ERROR,
        })
      );
    }
  };

  useEffect(() => {
    if (status === 'succeeded') {
      onClose();
      dispatch(resetUserStatus());
    }
  }, [status, onClose]);

  if (!isOpen) return null;

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
        return 'bg-orange-500';
      case 2:
        return 'bg-red-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Medium';
      case 4:
        return 'Strong';
      default:
        return 'Weak';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full mx-2 sm:mx-auto">
        <h2 className="text-2xl font-bold mb-6">Set New Password</h2>
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={newPassword}
              onChange={handlePasswordChange}
              required
            />
            <div className="h-2 mt-2 w-full bg-gray-300 rounded">
              <div className={`h-2 rounded ${getStrengthColor()}`} style={{ width: `${(passwordStrength / 4) * 100}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">At least 8 characters and at least 2 numbers</p>
            <p className={`text-sm mt-1 ${getStrengthColor().replace('bg', 'text')}`}>{getStrengthLabel()}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Repeat New Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 mb-4">{typeof error === 'string' ? error : JSON.stringify(error)}</div>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? <Skeleton width={100} /> : 'Confirm'}
          </button>
        </form>
      </div>
    </div>
  );
};

UpdatePasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UpdatePasswordModal;
