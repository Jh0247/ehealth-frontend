import React from 'react';
import PropTypes from 'prop-types';
import MedicationSelect from './MedicationSelect';
import { Icon } from '@iconify/react';
import closeIcon from '@iconify-icons/mdi/close';

const PrescriptionField = ({ index, medications, formData, handleChange, handleRemove }) => (
  <div className="mb-4 flex flex-col relative">
    <div className="flex items-center justify-between mb-2">
      <span className="font-bold">Prescription {index + 1}</span>
      <Icon
        icon={closeIcon}
        className="w-5 h-5 cursor-pointer text-red-500"
        onClick={() => handleRemove(index)}
      />
    </div>
    <div className="grid grid-flow-row grid-cols-4 gap-4">
      <MedicationSelect
        medications={medications}
        value={String(formData.medication_id) || ''}
        onChange={(value) => handleChange(index, 'medication_id', value)}
      />
      <input
        type="text"
        placeholder="Dosage"
        className="w-full p-2 border border-gray-300 rounded mb-2"
        value={formData.dosage || ''}
        onChange={(e) => handleChange(index, 'dosage', e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Frequency"
        className="w-full p-2 border border-gray-300 rounded mb-2"
        value={formData.frequency || ''}
        onChange={(e) => handleChange(index, 'frequency', e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Duration"
        className="w-full p-2 border border-gray-300 rounded mb-2"
        value={formData.duration || ''}
        onChange={(e) => handleChange(index, 'duration', e.target.value)}
        required
      />
    </div>
  </div>
);

PrescriptionField.propTypes = {
  index: PropTypes.number.isRequired,
  medications: PropTypes.arrayOf(PropTypes.object).isRequired,
  formData: PropTypes.shape({
    medication_id: PropTypes.string,
    dosage: PropTypes.string,
    frequency: PropTypes.string,
    duration: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default PrescriptionField;
