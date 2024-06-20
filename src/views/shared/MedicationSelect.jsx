import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const MedicationSelect = ({ medications, value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const selectedMedication = medications.find((med) => med.id === Number(value));
    if (selectedMedication) {
      setSearchTerm(selectedMedication.name);
    } else {
      setSearchTerm('');
    }
  }, [value, medications]);

  const filteredMedications = medications.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (med) => {
    onChange(String(med.id));
    setSearchTerm(med.name);
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredMedications.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      handleSelect(filteredMedications[highlightedIndex]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Search medications..."
        className="w-full p-2 border border-gray-300 rounded mb-2"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        required
      />
      {showDropdown && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
          {filteredMedications.length > 0 ? (
            filteredMedications.map((med, index) => (
              <li
                key={med.id}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${
                  highlightedIndex === index ? 'bg-gray-200' : ''
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleSelect(med)}
              >
                {med.name}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No medications found</li>
          )}
        </ul>
      )}
    </div>
  );
};

MedicationSelect.propTypes = {
  medications: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MedicationSelect;
