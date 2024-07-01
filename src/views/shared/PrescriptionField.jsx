import React from 'react';
import PropTypes from 'prop-types';
import MedicationSelect from './MedicationSelect';
import { Icon } from '@iconify/react';
import closeIcon from '@iconify-icons/mdi/close';

const dosageUnits = ['pills', 'ml'];
const frequencyOptions = ['once a day', 'twice a day', 'three times a day', 'four times a day'];
const durationUnits = ['days', 'weeks', 'months'];

const PrescriptionField = ({ index, medications, formData, handleChange, handleRemove, isEditable }) => {
  return (
    <div className="flex flex-col relative">
      <div className="flex items-center justify-between">
        {isEditable && (
          <>
            <span className="font-bold">Prescription {index + 1}</span>
            <Icon
              icon={closeIcon}
              className="w-5 h-5 cursor-pointer text-red-500"
              onClick={() => handleRemove(index)}
            />
          </>
        )}
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
          <>
            <div className="flex">
              <input
                type="number"
                placeholder="Dosage"
                className="w-full p-2 border border-gray-300 rounded mb-2"
                value={formData.dosage || ''}
                onChange={(e) => handleChange(index, 'dosage', e.target.value)}
                required
              />
              <select
                className="w-full p-2 border border-gray-300 rounded mb-2 ml-2"
                value={formData.dosageUnit || ''}
                onChange={(e) => handleChange(index, 'dosageUnit', e.target.value)}
                required
              >
                <option disabled value=''>Select</option>
                {dosageUnits.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div className="border-r-2 border-r-white hidden sm:block">{formData.dosage} {formData.dosageUnit}</div>
        )}
        {isEditable ? (
          <select
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={formData.frequency || ''}
            onChange={(e) => handleChange(index, 'frequency', e.target.value)}
            required
          >
            <option disabled value=''>Frequency</option>
            {frequencyOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <div className="border-r-2 border-r-white hidden sm:block">{formData.frequency}</div>
        )}
        {isEditable ? (
          <div className="flex">
            <input
              type="number"
              placeholder="Duration"
              className="w-full p-2 border border-gray-300 rounded mb-2"
              value={formData.duration || ''}
              onChange={(e) => handleChange(index, 'duration', e.target.value)}
              required
            />
            <select
              className="w-full p-2 border border-gray-300 rounded mb-2 ml-2"
              value={formData.durationUnit || ''}
              onChange={(e) => handleChange(index, 'durationUnit', e.target.value)}
              required
            >
              <option disabled value=''>Select</option>
              {durationUnits.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="border-r-2 border-r-white hidden sm:block">{formData.duration} {formData.durationUnit}</div>
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
    dosageUnit: PropTypes.string,
    frequency: PropTypes.string,
    duration: PropTypes.string,
    durationUnit: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  isEditable: PropTypes.bool.isRequired,
};

export default PrescriptionField;
