import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import closeIcon from '@iconify-icons/mdi/close';

const MedicationDetailsModal = ({ isOpen, onClose }) => {
  const { medicationDetails } = useSelector((state) => state.medication);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full mx-2 max-h-full overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <Icon icon={closeIcon} className="w-6 h-6" />
        </button>
        {medicationDetails ? (
          <div>
            <h2 className="text-center text-xl md:text-2xl font-bold mb-4">{medicationDetails.name}</h2>
            <p className="text-sm sm:text-base mb-2"><strong>Description:</strong> {medicationDetails.description}</p>
            <p className="text-sm sm:text-base mb-2"><strong>Ingredient:</strong> {medicationDetails.ingredient}</p>
            <p className="text-sm sm:text-base mb-2"><strong>Form:</strong> {medicationDetails.form}</p>
            <p className="text-sm sm:text-base mb-2"><strong>Usage:</strong> {medicationDetails.usage}</p>
            <p className="text-sm sm:text-base mb-2"><strong>Strength:</strong> {medicationDetails.strength}</p>
            <p className="text-sm sm:text-base mb-2"><strong>Manufacturer:</strong> {medicationDetails.manufacturer}</p>
            <p className="text-sm sm:text-base mb-2"><strong>Price:</strong> ${medicationDetails.price}</p>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

MedicationDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MedicationDetailsModal;
