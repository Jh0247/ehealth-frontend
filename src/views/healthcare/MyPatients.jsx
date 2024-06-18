import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPatientsByDoctor } from '../../redux/features/healthcareProviderSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import noDataImage from '../../assets/noData.png';
import defaultImage from '../../assets/default.jpg';
import { Icon } from '@iconify/react';
import arrowRightIcon from '@iconify-icons/mdi/arrow-right';
import { rolePathMap } from '../../constants/rolePath';

const MyPatients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients, status } = useSelector((state) => state.healthcareProvider);
  const { user_info } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);

  useEffect(() => {
    dispatch(getPatientsByDoctor());
  }, [dispatch]);

  useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();
    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query) ||
      patient.icno.toLowerCase().includes(query)
    );
    setFilteredPatients(filtered);
  };

  const renderPatient = (patient, index) => (
    <li
      key={index}
      className="flex justify-center sm:justify-between items-center border-b border-t py-2"
      onClick={() => navigate(`${rolePathMap[user_info?.user_role]}/health-record`, { state: { userId: patient.id } })}
    >
      <div className="flex items-center flex-col sm:flex-row justify-center">
        <img
          src={patient.profile_img || defaultImage}
          alt={patient.name}
          className="w-24 h-24 rounded-full sm:mr-4"
        />
        <div className="justify-center text-center sm:text-left mt-3 sm:mt-0">
          <h4 className="text-sm sm:text-base font-semibold mb-2">{patient.name}</h4>
          <p className="text-sm sm:text-base text-gray-600 mb-2"><strong>Tel: </strong>{patient.contact}</p>
          <p className="text-sm sm:text-base text-gray-600 mb-2"><strong>Email: </strong>{patient.email}</p>
          <p className="text-sm sm:text-base text-gray-600 mb-2"><strong>IC: </strong>{patient.icno}</p>
        </div>
      </div>
      <div className="text-sm items-center hidden sm:flex">
        <span className="block text-gray-600 mr-4">{patient.health_condition}</span>
        <span className="block text-gray-600 mr-4">{patient.blood_type}</span>
        <button className="hidden sm:block bg-[#347576] hover:bg-[#285D5E] text-white py-1 px-2 rounded">
          View Details
        </button>
        <Icon icon={arrowRightIcon} className="block sm:hidden w-5 h-5 text-[#347576]" />
      </div>
    </li>
  );

  return (
    <div className="flex flex-col p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6">My Patients</h3>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name, email, or IC..."
          className="p-2 flex-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 md:p-6 min-h-[200px]">
        <ul>
          {status === 'loading' ? (
            Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="flex justify-between items-center border-b py-2">
                <Skeleton width={200} height={20} />
              </li>
            ))
          ) : (
            Array.isArray(filteredPatients) && filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => renderPatient(patient, index))
            ) : (
              <div className="flex flex-col items-center">
                <img src={noDataImage} alt="No Patients Found" className="w-32 h-32" />
                <span className="text-center text-gray-500 py-2">No Patients Found</span>
              </div>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default MyPatients;
