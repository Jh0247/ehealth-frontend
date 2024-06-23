import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import closeIcon from '@iconify-icons/mdi/close';

const PrescriptionModal = ({ isOpen, onClose, prescriptions, onCreatePurchase, userId, pharmacistId }) => {
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (isOpen) {
      const initialQuantities = prescriptions.reduce((acc, prescription) => {
        acc[prescription.id] = 1; // default quantity to 1
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [isOpen, prescriptions]);

  if (!isOpen) return null;

  const totalPrice = prescriptions.reduce((acc, prescription) => {
    const quantity = quantities[prescription.id] || 1;
    return acc + parseFloat(prescription.medication.price || 0) * quantity;
  }, 0);

  const handleQuantityChange = (prescriptionId, value) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [prescriptionId]: parseInt(value, 10) || 1
    }));
  };

  const handleCreatePurchase = () => {
    const purchaseData = prescriptions.map(prescription => ({
      user_id: userId,
      pharmacist_id: pharmacistId,
      medication_id: prescription.medication.id,
      date_purchase: new Date().toISOString().split('T')[0],
      quantity: quantities[prescription.id] || 1,
      total_payment: parseFloat(prescription.medication.price) * (quantities[prescription.id] || 1),
    }));
    onCreatePurchase(purchaseData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full mx-2 max-h-full overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <Icon icon={closeIcon} className="w-6 h-6" />
        </button>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#285D5E]">Prescriptions</h2>
        {prescriptions.length === 0 ? (
          <p>No prescriptions available.</p>
        ) : (
          <>
            <p className="text-lg font-bold mb-4">Total Price: ${totalPrice.toFixed(2)}</p>
            {prescriptions.map(prescription => (
              <div key={prescription.id} className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 flex flex-col mb-4">
                <h4 className="text-lg mb-2">Medication: <strong>{prescription.medication.name}</strong></h4>
                <p className="mb-2">Dosage: <strong>{prescription.dosage}</strong></p>
                <p className="mb-2">Frequency: <strong>{prescription.frequency}</strong></p>
                <p className="mb-2">Duration: <strong>{prescription.duration}</strong></p>
                <p className="mb-2">Price: <strong>${prescription.medication.price}</strong></p>
                <div className="mb-2">
                  <label htmlFor={`quantity-${prescription.id}`} className="block text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <input
                    id={`quantity-${prescription.id}`}
                    type="number"
                    min="1"
                    value={quantities[prescription.id] || 1}
                    onChange={(e) => handleQuantityChange(prescription.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            ))}
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              onClick={handleCreatePurchase}
            >
              Create Purchase Record
            </button>
          </>
        )}
      </div>
    </div>
  );
};

PrescriptionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  prescriptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    medication: PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
    }).isRequired,
    dosage: PropTypes.string.isRequired,
    frequency: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
  })).isRequired,
  onCreatePurchase: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  pharmacistId: PropTypes.number.isRequired,
};

export default PrescriptionModal;
