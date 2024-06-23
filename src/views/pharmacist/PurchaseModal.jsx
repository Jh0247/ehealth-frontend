import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import closeIcon from '@iconify-icons/mdi/close';
import AddMedication from './AddMedication';

const PurchaseModal = ({ isOpen, onClose, user, medications, onCreatePurchase }) => {
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (isOpen) {
      setSelectedMedications([]);
      setQuantities({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalPrice = selectedMedications.reduce((acc, med) => {
    const quantity = quantities[med.id] || 1;
    return acc + parseFloat(med.price || 0) * quantity;
  }, 0);

  const handleAddMedication = (medication) => {
    if (!selectedMedications.some(med => med.id === medication.id)) {
      setSelectedMedications([...selectedMedications, medication]);
      setQuantities({ ...quantities, [medication.id]: 1 });
    }
  };

  const handleQuantityChange = (medicationId, value) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [medicationId]: parseInt(value, 10) || 1
    }));
  };

  const handleCreatePurchase = () => {
    const purchaseData = selectedMedications.map(medication => ({
      user_id: user.id,
      medication_id: medication.id,
      date_purchase: new Date().toISOString().split('T')[0],
      quantity: quantities[medication.id] || 1,
      total_payment: parseFloat(medication.price) * (quantities[medication.id] || 1),
    }));
    onCreatePurchase(purchaseData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full mx-2 max-h-full overflow-y-auto min-h-[500px] min-h-">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <Icon icon={closeIcon} className="w-6 h-6" />
        </button>
        <h2 className="text-xl md:text-2xl font-bold mb-4">Add Purchase Record</h2>
        <p className="text-lg font-bold mb-4">Total Price: ${totalPrice.toFixed(2)}</p>
        <AddMedication
          medications={medications}
          onAddMedication={handleAddMedication}
        />
        <div className="mt-4">
          {selectedMedications.map(medication => (
            <div key={medication.id} className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 flex flex-col mb-4">
              <h4 className="text-lg mb-2">Medication: <strong>{medication.name}</strong></h4>
              <p className="mb-2">Price: <strong>${medication.price}</strong></p>
              <div className="mb-2">
                <label htmlFor={`quantity-${medication.id}`} className="block text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <input
                  id={`quantity-${medication.id}`}
                  type="number"
                  min="1"
                  value={quantities[medication.id] || 1}
                  onChange={(e) => handleQuantityChange(medication.id, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-4"
          onClick={handleCreatePurchase}
        >
          Create Purchase Record
        </button>
      </div>
    </div>
  );
};

PurchaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  medications: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCreatePurchase: PropTypes.func.isRequired,
};

export default PurchaseModal;
