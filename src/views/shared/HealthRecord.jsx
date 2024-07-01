import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import emailIcon from '@iconify-icons/mdi/email';
import phoneIcon from '@iconify-icons/mdi/phone';
import idCardIcon from '@iconify-icons/mdi/id-card';
import healthyIcon from '@iconify-icons/mdi/emoticon-happy';
import bloodTypeIcon from '@iconify-icons/mdi/health-potion';
import editIcon from '@iconify-icons/mdi/pencil';
import defaultImage from '../../assets/default.jpg';
import foodAllergicImage from '../../assets/foodAllergic.png';
import environmentAllergicImage from '../../assets/environmentAllergic.png';
import drugAllergicImage from '../../assets/drugAllergic.png';
import diseaseImage from '../../assets/disease.png';
import noMedicationImage from '../../assets/noMedication.png';
import { getUserHealth, getUserMedications } from '../../redux/features/userSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchMedicationDetails } from '../../redux/features/medicationSlice';
import HealthRecordUpdateModal from '../healthcare/HealthRecordUpdateModal';
import MedicationDetailsModal from './MedicationDetailsModal';

const HealthRecord = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userId } = location.state || {};
  const { user_info, health_record, medications, status } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medicationModalOpen, setMedicationModalOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      // Fetch data for a specific user (admin view)
      dispatch(getUserMedications(userId));
      dispatch(getUserHealth(userId));
    } else {
      // Fetch data for the logged-in user
      dispatch(getUserMedications());
      dispatch(getUserHealth());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (status === 'succeeded' && isModalOpen) {
      setIsModalOpen(false);
    }
  }, [status, isModalOpen]);

  const handleViewDetails = (id) => {
    dispatch(fetchMedicationDetails(id)).then(() => {
      setMedicationModalOpen(true);
    });
  };

  const parseAllergic = (allergic) => {
    try {
      return JSON.parse(allergic);
    } catch (e) {
      return {};
    }
  };

  const allergic = health_record?.health_record?.allergic ? parseAllergic(health_record.health_record.allergic) : {};

  return (
    <div className="flex flex-col p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6">Profile</h3>
      <div className="bg-white rounded shadow-md shadow-teal-800 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center relative">
        <div className="flex items-center flex-col md:flex-row">
          {status === 'loading' ? (
            <Skeleton circle={true} height={144} width={144} className="my-2 md:my-0 md:mr-9" />
          ) : (
            <img
              src={health_record?.profile_img || defaultImage}
              alt="Profile"
              className="w-36 h-36 rounded-full my-2 md:my-0 md:mr-9 border object-cover"
            />
          )}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold my-2">
              {status === 'loading' ? <Skeleton width={120} /> : health_record?.name}
            </h2>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={idCardIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={120} /> : health_record?.icno}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={emailIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={180} /> : health_record?.email}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={phoneIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={120} /> : health_record?.contact}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={healthyIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={60} /> : (health_record?.health_record?.health_condition || 'N/A')}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={bloodTypeIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={20} /> : (health_record?.health_record?.blood_type || 'N/A')}
            </p>
          </div>
        </div>
        {user_info?.user_role === 'doctor' && (
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            onClick={() => setIsModalOpen(true)}
          >
            <Icon icon={editIcon} className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="my-8">
        <h3 className="text-xl font-bold mb-4">Allergic</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded shadow-sm shadow-teal-800 p-4">
            <img
              src={foodAllergicImage}
              alt="Food Allergic"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h4 className="text-md font-bold">Food Allergic</h4>
            <ul className="list-disc list-inside">
              {status === 'loading' ? <Skeleton count={1} width={120} /> : (
                (allergic.Food && allergic.Food.length > 0) ? allergic.Food.map((item, index) => (
                  <li key={index}>{item}</li>
                )) : <li>None</li>
              )}
            </ul>
          </div>
          <div className="bg-white rounded shadow-sm shadow-teal-800 p-4">
            <img
              src={environmentAllergicImage}
              alt="Environment Allergic"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h4 className="text-md font-bold">Environment Allergic</h4>
            <ul className="list-disc list-inside">
              {status === 'loading' ? <Skeleton count={2} width={120} /> : (
                (allergic.Environmental && allergic.Environmental.length > 0) ? allergic.Environmental.map((item, index) => (
                  <li key={index}>{item}</li>
                )) : <li>None</li>
              )}
            </ul>
          </div>
          <div className="bg-white rounded shadow-sm shadow-teal-800 p-4">
            <img
              src={drugAllergicImage}
              alt="Drug Allergic"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h4 className="text-md font-bold">Drug Allergic</h4>
            <ul className="list-disc list-inside">
              {status === 'loading' ? <Skeleton count={2} width={120} /> : (
                (allergic.Drug && allergic.Drug.length > 0) ? allergic.Drug.map((item, index) => (
                  <li key={index}>{item}</li>
                )) : <li>None</li>
              )}
            </ul>
          </div>
          <div className="bg-white rounded shadow-sm shadow-teal-800 p-4">
            <img
              src={diseaseImage}
              alt="Disease"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h4 className="text-md font-bold">Disease</h4>
            <ul className="list-disc list-inside">
              {status === 'loading' ? <Skeleton count={2} width={120} /> : (
                (health_record?.health_record?.diseases && health_record.health_record.diseases.length > 0) ? health_record.health_record.diseases.split(',').map((item, index) => (
                  <li key={index}>{item}</li>
                )) : <li>None</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {/* On-going Medication */}
      <div className="mb-8">
        <h3 className="text-lg font-bold">On-going Medication</h3>
        <div className="bg-white p-4 rounded-lg shadow-sm shadow-teal-800 my-4 max-h-52 overflow-y-auto min-h-[300px]">
          <ul>
            {status === 'loading' ? (
              Array.from({ length: 5 }).map((_, index) => (
                <li key={index} className="flex justify-between items-center border-b py-2">
                  <Skeleton width={200} height={20} />
                </li>
              ))
            ) : (
              Array.isArray(medications) && medications.length > 0 ? (
                medications.map((medication, index) => (
                  <li onClick={() => handleViewDetails(medication?.medication_id)} key={index} className="flex justify-between items-center border-b py-2">
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base"><strong>{medication?.medication_name}</strong></span>
                      <span className="text-sm sm:text-base my-2">Start on: <strong>{medication?.start_date}</strong></span>
                      <span className="text-sm sm:text-base">End on: <strong>{medication?.end_date}</strong></span>
                    </div>
                    <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded">{medication?.dosage}</button>
                  </li>
                ))
              ) : (
                <div className="flex flex-col items-center">
                  <img src={noMedicationImage} alt="No Medications Found" className="w-32 h-32" />
                  <span className="text-center text-gray-500 py-2">No Medications Found</span>
                </div>
              )
            )}
          </ul>
        </div>
      </div>
      <MedicationDetailsModal
        isOpen={medicationModalOpen}
        onClose={() => setMedicationModalOpen(false)}
      />
      <HealthRecordUpdateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default HealthRecord;