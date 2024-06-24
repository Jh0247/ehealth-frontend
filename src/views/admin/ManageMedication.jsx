import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CreateMedicationModal from './CreateMedicationModal';
import { fetchMedications, createMedication, updateMedication } from '../../redux/features/medicationSlice';
import { Icon } from '@iconify/react';
import arrowDown from '@iconify-icons/mdi/arrow-down';
import arrowUp from '@iconify-icons/mdi/arrow-up';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const ManageMedication = () => {
  const dispatch = useDispatch();
  const { medications = [], status } = useSelector((state) => state.medication);
  const [sortedMedications, setSortedMedications] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedForm, setSelectedForm] = useState('');

  useEffect(() => {
    dispatch(fetchMedications());
  }, [dispatch]);

  useEffect(() => {
    if (medications.length > 0) {
      handleSort('name', 'ascending');
    }
  }, [medications]);

  const handleSort = (key, direction) => {
    if (!direction) {
      direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }
    setSortConfig({ key, direction });

    const sortedArray = [...medications].sort((a, b) => {
      if (key === 'name' || key === 'form' || key === 'manufacturer') {
        return direction === 'ascending'
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      } else if (key === 'price') {
        return direction === 'ascending'
          ? parseFloat(a[key]) - parseFloat(b[key])
          : parseFloat(b[key]) - parseFloat(a[key]);
      } else {
        return direction === 'ascending'
          ? a[key] - b[key]
          : b[key] - a[key];
      }
    });
    setSortedMedications(sortedArray);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <Icon className="ml-2" icon={arrowUp} /> : <Icon className="ml-2" icon={arrowDown} />;
  };

  const handleEdit = (medication) => {
    setSelectedMedication(medication);
    setEditModalOpen(true);
  };

  const renderMedication = (medication, index) => (
    <li
      key={index}
      className="flex justify-between items-center border-b py-2"
    >
      <div className="flex w-full my-2">
        <div className="flex flex-col w-2/4 sm:w-1/4 border-r-2 border-gray-300 pr-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            <strong>Name: </strong> {medication.name}
          </span>
        </div>
        <div className="flex flex-col w-2/4 sm:w-1/4 border-r-2 border-gray-300 px-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            <strong>Form: </strong> {medication.form}
          </span>
        </div>
        <div className="hidden sm:flex flex-col w-1/4 border-r-2 border-gray-300 px-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            <strong>Manufacturer: </strong> {medication.manufacturer}
          </span>
        </div>
        <div className="hidden sm:flex flex-col w-1/4 border-r-2 border-gray-300 px-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            <strong>Price: </strong> ${medication.price}
          </span>
        </div>
        <button
          onClick={() => handleEdit(medication)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded ml-2"
        >
          Edit
        </button>
      </div>
    </li>
  );

  const handleCreateMedication = (formData) => {
    dispatch(createMedication(formData)).then(() => {
      setCreateModalOpen(false);
    });
  };

  const handleUpdateMedication = (id, formData) => {
    dispatch(updateMedication({ id, formData })).then(() => {
      setEditModalOpen(false);
    });
  };

  const filteredMedications = sortedMedications.filter(medication => {
    return (
      medication.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      medication.price >= priceRange[0] &&
      medication.price <= priceRange[1] &&
      (selectedManufacturer ? medication.manufacturer === selectedManufacturer : true) &&
      (selectedForm ? medication.form === selectedForm : true)
    );
  });

  const uniqueManufacturers = [...new Set(medications.map(med => med.manufacturer))];
  const uniqueForms = [...new Set(medications.map(med => med.form))];

  return (
    <div className="flex flex-col p-5 md:p-9">
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between">
        <h3 className="text-xl md:text-2xl font-bold mb-6">Manage Medication</h3>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-6"
        >
          Create Medication
        </button>
      </div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-2 sm:w-1/4"
          />
          <div className="hidden sm:flex flex-col sm:w-1/4 mb-2 sm:mb-0">
            <label>Price Range</label>
            <Slider
              range
              min={0}
              max={100}
              defaultValue={priceRange}
              value={priceRange}
              onChange={setPriceRange}
              className="mt-1"
            />
            <div className="flex justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
          <div className="hidden sm:flex flex-col sm:w-1/4 mb-2 sm:mb-0">
            <label>Manufacturer</label>
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="p-2 border border-gray-300 rounded mt-1"
            >
              <option value="">All</option>
              {uniqueManufacturers.map((manufacturer, index) => (
                <option key={index} value={manufacturer}>{manufacturer}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:w-1/4 mb-2 sm:mb-0">
            <label>Form</label>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="p-2 border border-gray-300 rounded mt-1"
            >
              <option value="">All</option>
              {uniqueForms.map((form, index) => (
                <option key={index} value={form}>{form}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="relative bg-gray-100 rounded-lg shadow-inner">
        <div className="sticky top-0 bg-gray-100 p-4 rounded-t-lg shadow-md">
          <div className="flex justify-between mb-2">
            <div className="flex flex-row w-2/4 sm:w-1/4 sm:text-base cursor-pointer items-center" onClick={() => handleSort('name')}>
              <strong>Name</strong> {renderSortIcon('name')}
            </div>
            <div className="flex flex-row w-2/4 sm:w-1/4 sm:text-base cursor-pointer items-center" onClick={() => handleSort('form')}>
              <strong>Form</strong> {renderSortIcon('form')}
            </div>
            <div className="flex-row hidden sm:flex sm:w-1/4 sm:text-base cursor-pointer items-center" onClick={() => handleSort('manufacturer')}>
              <strong>Manufacturer</strong> {renderSortIcon('manufacturer')}
            </div>
            <div className="flex-row hidden sm:flex sm:w-1/4 sm:text-base cursor-pointer items-center" onClick={() => handleSort('price')}>
              <strong>Price</strong> {renderSortIcon('price')}
            </div>
          </div>
        </div>
        <ul className="max-h-[70vh] overflow-y-auto px-4 py-2">
          {status === 'loading' ? (
            Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="flex justify-between items-center border-b py-2">
                <Skeleton width={200} height={20} />
              </li>
            ))
          ) : filteredMedications.length > 0 ? (
            filteredMedications.map((medication, index) => renderMedication(medication, index))
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-center text-gray-500 py-2">No Medications Found</span>
            </div>
          )}
        </ul>
      </div>
      <CreateMedicationModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateMedication}
      />
      {selectedMedication && (
        <CreateMedicationModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onCreate={(formData) => handleUpdateMedication(selectedMedication.id, formData)}
          initialData={selectedMedication}
        />
      )}
    </div>
  );
};

export default ManageMedication;
