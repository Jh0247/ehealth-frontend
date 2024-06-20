import React from 'react';
import PropTypes from 'prop-types';
import MedicationSelect from './MedicationSelect';
import { Icon } from '@iconify/react';
import closeIcon from '@iconify-icons/mdi/close';

const PrescriptionField = ({ index, medications, formData, handleChange, handleRemove, isEditable }) => {
  return (
    <div className="mb-4 flex flex-col relative">
      <div className="flex items-center justify-between">
        {isEditable? (
          <>
          <span className="font-bold">Prescription {index + 1}</span>
          <Icon
            icon={closeIcon}
            className="w-5 h-5 cursor-pointer text-red-500"
            onClick={() => handleRemove(index)}
          />
          </>
        ):
        <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-4 gap-4 w-full p-2 bg-slate-100">
          <span className="font-bold border-r-2 border-gray-300">Name</span>
          <span className="font-bold border-r-2 border-gray-300 hidden sm:block">Dosage</span>
          <span className="font-bold border-r-2 border-gray-300 hidden sm:block">Frequency</span>
          <span className="font-bold border-r-2 border-gray-300 hidden sm:block">Duration</span>
        </div>
        }
      </div>
      <div className={`grid grid-flow-row grid-cols-1 sm:grid-cols-4 gap-4 mt-2 ${!isEditable && 'mt-0 bg-gray-200 p-2'}`}>
        {isEditable ? (
          <MedicationSelect
            medications={medications}
            value={formData.medication_id?.toString() || ''}
            onChange={(value) => handleChange(index, 'medication_id', value)}
          />
        ) : (
          <div className="border-r-2 border-r-white">{medications.find((med) => med.id === parseInt(formData.medication_id, 10))?.name || 'N/A'}</div>
        )}
        {isEditable ? (
          <input
            type="text"
            placeholder="Dosage"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={formData.dosage || ''}
            onChange={(e) => handleChange(index, 'dosage', e.target.value)}
            required
          />
        ) : (
          <div className="border-r-2 border-r-white hidden sm:block">{formData.dosage}</div>
        )}
        {isEditable ? (
          <input
            type="text"
            placeholder="Frequency"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={formData.frequency || ''}
            onChange={(e) => handleChange(index, 'frequency', e.target.value)}
            required
          />
        ) : (
          <div className="border-r-2 border-r-white hidden sm:block">{formData.frequency}</div>
        )}
        {isEditable ? (
          <input
            type="text"
            placeholder="Duration"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={formData.duration || ''}
            onChange={(e) => handleChange(index, 'duration', e.target.value)}
            required
          />
        ) : (
          <div className="border-r-2 border-r-white hidden sm:block">{formData.duration}</div>
        )}
      </div>
    </div>
  );
};

PrescriptionField.propTypes = {
  index: PropTypes.number.isRequired,
  medications: PropTypes.arrayOf(PropTypes.object).isRequired,
  formData: PropTypes.shape({
    medication_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dosage: PropTypes.string,
    frequency: PropTypes.string,
    duration: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  isEditable: PropTypes.bool.isRequired,
};

export default PrescriptionField;
