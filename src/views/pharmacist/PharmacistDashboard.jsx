import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import defaultImage from '../../assets/default.jpg';
import ProfileUpdateModal from '../shared/ProfileUpdateModal';

import emailIcon from '@iconify-icons/mdi/email';
import phoneIcon from '@iconify-icons/mdi/phone';
import editIcon from '@iconify-icons/mdi/pencil-outline';
import businessIcon from '@iconify-icons/mdi/business';
import accountIcon from '@iconify-icons/mdi/account';

export default function PharmacistDashboard(){
  const { user_info, status} = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return(
    <div className="flex flex-col p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6">Dashboard</h3>
      {/* Profile Card */}
      <div className="bg-white rounded shadow-md shadow-teal-800 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center relative">
        <div className="flex items-center flex-col md:flex-row">
          {status === 'loading' ? (
            <Skeleton circle={true} height={144} width={144} className="my-2 md:my-0 md:mr-9" />
          ) : (
            <img
              src={user_info?.profile_img || defaultImage}
              alt="Profile"
              className={"w-36 h-36 rounded-full my-2 md:my-0 md:mr-9 border object-cover"}
            />
          )}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold my-2">
              {status === 'loading' ? <Skeleton width={120} /> : user_info?.name}
            </h2>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={emailIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={180} /> : user_info?.email}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={phoneIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={120} /> : user_info?.contact}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={businessIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={120} /> : user_info?.organization?.name}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={accountIcon} className="w-5 h-5 mr-2" />
              {status === 'loading' ? <Skeleton width={120} /> : user_info?.user_role}
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
      {/* Manage Purchase Record */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-3">Manage Purchase Record</h3>
        <Link to="/pharmacist/manage-purchase-record">
          <button className="bg-[#347576] hover:bg-[#285D5E] text-white py-2 px-4 rounded w-full">
            Add Purchase Record
          </button>
        </Link>
      </div>
      <ProfileUpdateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}