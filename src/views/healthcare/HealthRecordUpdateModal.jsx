import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import closeIcon from '@iconify-icons/mdi/close';
import {
  healthConditions,
  bloodTypes,
  allFoodAllergies,
  allEnvironmentalAllergies,
  allDrugAllergies,
  allDiseases
} from '../../constants/healthData';
import { updateUserHealthRecord } from '../../redux/features/userSlice';

const HealthRecordUpdateModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { health_record, status } = useSelector((state) => state.user);

  const parseAllergicField = (allergic) => {
    try {
      const parsed = JSON.parse(allergic);
      return {
        Food: parsed.Food || [],
        Environmental: parsed.Environmental || [],
        Drug: parsed.Drug || [],
      };
    } catch (e) {
      return { Food: [], Environmental: [], Drug: [] };
    }
  };  

  const initialState = {
    health_condition: '',
    blood_type: '',
    allergic: { Food: [], Environmental: [], Drug: [] },
    diseases: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAnimationClass('animate-fadeIn');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && health_record) {
      setFormData({
        health_condition: health_record.health_record?.health_condition || '',
        blood_type: health_record.health_record?.blood_type || '',
        allergic: parseAllergicField(health_record.health_record?.allergic) || { Food: [], Environmental: [], Drug: [] },
        diseases: health_record.health_record?.diseases || ''
      });
    }
  }, [isOpen, health_record]);

  const handleCheckboxChange = (type, value) => {
    setFormData((prev) => {
      const updatedAllergies = { ...prev.allergic };
      if (updatedAllergies[type]?.includes(value)) {
        updatedAllergies[type] = updatedAllergies[type].filter((item) => item !== value);
      } else {
        updatedAllergies[type].push(value);
      }
      return { ...prev, allergic: updatedAllergies };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { allergic, ...otherData } = formData;
    const filteredAllergic = {};
    for (const key in allergic) {
      const filteredArray = allergic[key].filter(item => item !== '');
      if (filteredArray.length > 0) {
        filteredAllergic[key] = filteredArray;
      }
    }
    const updatedData = {
      ...otherData,
      allergic: Object.keys(filteredAllergic).length > 0 ? filteredAllergic : ['None'],
    };

    await dispatch(updateUserHealthRecord({ id: health_record?.health_record?.id, data: updatedData }));
    closeModal();
  };

  const closeModal = () => {
    setAnimationClass('animate-fadeOut');
    setTimeout(() => {
      setFormData(initialState);
      setAnimationClass('');
      onClose();
    }, 500);
  };

  if (!isOpen && animationClass === '') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className={`bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full mx-2 max-h-full overflow-y-auto ${animationClass}`}>
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={closeModal}
        >
          <Icon icon={closeIcon} className="w-6 h-6" />
        </button>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#285D5E]">Update Health Record</h2>
        {status === 'loading' ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm md:text-base font-medium text-gray-700">Health Condition</label>
              <select
                name="health_condition"
                value={formData.health_condition}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-1 md:px-2"
              >
                <option disabled value="">Select Condition</option>
                {healthConditions.map((condition) => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm md:text-base font-medium text-gray-700">Blood Type</label>
              <select
                name="blood_type"
                value={formData.blood_type}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-1 md:px-2"
              >
                <option disabled value="">Select Blood Type</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm md:text-base font-medium text-gray-700">Allergies</label>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData?.allergic?.Food?.length > 0}
                    onChange={() => handleCheckboxChange('Food', '')}
                    className="mr-2"
                  />
                  Food
                </label>
                {formData?.allergic?.Food?.length > 0 && (
                  <div className="ml-4">
                    {allFoodAllergies.map((item) => (
                      <label key={item} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData?.allergic?.Food?.includes(item)}
                          onChange={() => handleCheckboxChange('Food', item)}
                          className="mr-2"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData?.allergic?.Environmental?.length > 0}
                    onChange={() => handleCheckboxChange('Environmental', '')}
                    className="mr-2"
                  />
                  Environmental
                </label>
                {formData?.allergic?.Environmental?.length > 0 && (
                  <div className="ml-4">
                    {allEnvironmentalAllergies.map((item) => (
                      <label key={item} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData?.allergic?.Environmental?.includes(item)}
                          onChange={() => handleCheckboxChange('Environmental', item)}
                          className="mr-2"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData?.allergic?.Drug?.length > 0}
                    onChange={() => handleCheckboxChange('Drug', '')}
                    className="mr-2"
                  />
                  Drug
                </label>
                {formData?.allergic?.Drug?.length > 0 && (
                  <div className="ml-4">
                    {allDrugAllergies.map((item) => (
                      <label key={item} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData?.allergic?.Drug?.includes(item)}
                          onChange={() => handleCheckboxChange('Drug', item)}
                          className="mr-2"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm md:text-base font-medium text-gray-700">Diseases</label>
              <select
                name="diseases"
                value={formData.diseases}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-1 md:px-2"
              >
                <option disabled value="">Select Disease</option>
                <option value='None'>None</option>
                {allDiseases.map((disease) => (
                  <option key={disease} value={disease}>{disease}</option>
                ))}
              </select>
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
        )}
      </div>
    </div>
  );
};

HealthRecordUpdateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default HealthRecordUpdateModal;
