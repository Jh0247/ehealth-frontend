import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../redux/features/userSlice';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import closeIcon from '@iconify-icons/mdi/close';

const ProfileUpdateModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user_info } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: user_info?.name || '',
    email: user_info?.email || '',
    contact: user_info?.contact || '',
    profile_img: null,
  });
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAnimationClass('animate-fadeIn');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!formData.profile_img) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(formData.profile_img);
    setPreview(objectUrl);

    // Free memory when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.profile_img]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_img') {
      const file = files[0];
      if (file && file.size > 2 * 1024 * 1024) {
        setError('File size must be less than 2MB');
        setFormData((prev) => ({ ...prev, [name]: null }));
      } else {
        setError('');
        setFormData((prev) => ({ ...prev, [name]: file }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!error) {
      await dispatch(updateUserProfile(formData));
      closeModal();
    }
  };

  const closeModal = () => {
    setAnimationClass('animate-fadeOut');
    setTimeout(() => {
      setFormData({
        name: user_info?.name || '',
        email: user_info?.email || '',
        contact: user_info?.contact || '',
        profile_img: null,
      });
      setError('');
      setAnimationClass('');
      onClose();
    }, 500);
  };

  if (!isOpen && animationClass === '') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className={`bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full mx-2 ${animationClass}`}>
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={closeModal}
        >
          <Icon icon={closeIcon} className="w-6 h-6" />
        </button>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#285D5E]">Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm md:text-base font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-1 md:px-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm md:text-base font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-1 md:px-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm md:text-base font-medium text-gray-700">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-1 md:px-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm md:text-base font-medium text-gray-700">Profile Image</label>
            <input
              type="file"
              name="profile_img"
              onChange={handleChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E6F7F7] file:text-[#347576] hover:file:bg-[#D4F1F1]"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {preview && <img src={preview} alt="Profile Preview" className="mt-2 rounded-md shadow-md w-32 h-32 object-cover" />}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="mr-2 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-[#347576] text-white rounded-lg hover:bg-[#285D5E]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ProfileUpdateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProfileUpdateModal;
