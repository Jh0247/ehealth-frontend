import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
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
import { getUserHealth } from '../../redux/features/userSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ProfileUpdateModal from '../shared/ProfileUpdateModal';

export default function HealthRecord() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { user_info, health_record, status } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      // Fetch data for a specific user (admin view)
      dispatch(getUserHealth(userId));
    } else {
      // Fetch data for the logged-in user
      dispatch(getUserHealth());
    }
  }, [dispatch, userId]);

  return (
    <div className="flex flex-col p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6">Profile</h3>
      <div className="bg-white rounded shadow-md shadow-teal-800 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center relative">
        <div className="flex items-center flex-col md:flex-row">
          {status === 'loading' ? (
            <Skeleton circle={true} height={144} width={144} className="my-2 md:my-0 md:mr-9" />
          ) : (
            <img
              src={user_info?.profile_img || defaultImage}
              alt="Profile"
              className="w-36 h-36 rounded-full my-2 md:my-0 md:mr-9 border object-cover"
            />
          )}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold my-2">
              {status === 'loading' ? <Skeleton width={120} /> : user_info?.name}
            </h2>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={idCardIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={120} /> : user_info?.icno}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={emailIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={180} /> : user_info?.email}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={phoneIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={120} /> : user_info?.contact}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={healthyIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={60} /> : (health_record?.health_condition || 'N/A')}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={bloodTypeIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={20} /> : (health_record?.blood_type || 'N/A')}
            </p>
          </div>
        </div>
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={() => setIsModalOpen(true)}
        >
          <Icon icon={editIcon} className="w-6 h-6" />
        </button>
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
            <h4 className="text-md font-bold">Food allergic</h4>
            <ul className="list-disc list-inside">
              {status === 'loading' ? <Skeleton count={1} width={120} /> : <li>{health_record?.allergic?.food || 'None'}</li>}
            </ul>
          </div>
          <div className="bg-white rounded shadow-sm shadow-teal-800 p-4">
            <img
              src={environmentAllergicImage}
              alt="Environment Allergic"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h4 className="text-md font-bold">Environment allergic</h4>
            <ul className="list-disc list-inside">
              {status === 'loading' ? <Skeleton count={2} width={120} /> : (
                <>
                  <li>{health_record?.allergic?.environment || 'None'}</li>
                </>
              )}
            </ul>
          </div>
          <div className="bg-white rounded shadow-sm shadow-teal-800 p-4">
            <img
              src={drugAllergicImage}
              alt="Drug Allergic"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h4 className="text-md font-bold">Drug allergic</h4>
            <ul className="list-disc list-inside">
              {status === 'loading' ? <Skeleton count={2} width={120} /> : (
                <>
                  <li>{health_record?.allergic?.drug || 'None'}</li>
                </>
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
                <>
                  <li>{health_record?.diseases || 'None'}</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      <ProfileUpdateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
