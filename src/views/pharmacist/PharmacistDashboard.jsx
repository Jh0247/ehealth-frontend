import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Line, Bar } from 'react-chartjs-2';
import defaultImage from '../../assets/default.jpg';
import ProfileUpdateModal from '../shared/ProfileUpdateModal';
import emailIcon from '@iconify-icons/mdi/email';
import phoneIcon from '@iconify-icons/mdi/phone';
import editIcon from '@iconify-icons/mdi/pencil-outline';
import businessIcon from '@iconify-icons/mdi/business';
import accountIcon from '@iconify-icons/mdi/account';
import { fetchPurchaseStatistics } from '../../redux/features/purchaseSlice';

export default function PharmacistDashboard() {
  const dispatch = useDispatch();
  const { user_info, status: userStatus } = useSelector((state) => state.user);
  const { statistics, status: statsStatus } = useSelector((state) => state.purchase);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user_info?.organization_id) {
      dispatch(fetchPurchaseStatistics(user_info.organization_id));
    }
  }, [dispatch, user_info?.organization_id]);

  const getDailySalesData = () => {
    const labels = statistics?.daily_sales?.map(sale => sale.date) || [];
    const data = statistics?.daily_sales?.map(sale => sale.total_sales) || [];
    return {
      labels,
      datasets: [
        {
          label: 'Daily Sales',
          data,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.4)',
        },
      ],
    };
  };

  const getSalesByMedicationData = () => {
    const labels = statistics?.sales_by_medication?.map(sale => sale.medication_name) || [];
    const data = statistics?.sales_by_medication?.map(sale => sale.total_sales) || [];
    return {
      labels,
      datasets: [
        {
          label: 'Sales by Medication',
          data,
          backgroundColor: 'rgba(75,192,192,0.4)',
        },
      ],
    };
  };

  return (
    <div className="flex flex-col p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6">Dashboard</h3>
      {/* Profile Card */}
      <div className="bg-white rounded shadow-md shadow-teal-800 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center relative">
        <div className="flex items-center flex-col md:flex-row">
          {userStatus === 'loading' ? (
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
              {userStatus === 'loading' ? <Skeleton width={120} /> : user_info?.name}
            </h2>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={emailIcon} className="w-5 h-5 mr-2" />
              {userStatus === 'loading' ? <Skeleton width={180} /> : user_info?.email}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={phoneIcon} className="w-5 h-5 mr-2" />
              {userStatus === 'loading' ? <Skeleton width={120} /> : user_info?.contact}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={businessIcon} className="w-5 h-5 mr-2" />
              {userStatus === 'loading' ? <Skeleton width={120} /> : user_info?.organization?.name}
            </p>
            <p className="flex items-center text-gray-600 mt-2">
              <Icon icon={accountIcon} className="w-5 h-5 mr-2" />
              {userStatus === 'loading' ? <Skeleton width={120} /> : user_info?.user_role}
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
        <Link to="/pharmacist/add-purchase-record">
          <button className="bg-[#347576] hover:bg-[#285D5E] text-white py-2 px-4 rounded w-full">
            Add Purchase Record
          </button>
        </Link>
      </div>
      {/* Statistics */}
      <div className="mt-8">
        <h3 className="text-lg font-bold">Statistics</h3>
        <div className="flex flex-col sm:flex-row gap-6 mt-4 sm:w-full">
          <div className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 flex flex-col items-center text-center w-full">
            <h4 className="text-lg mb-2">Total Purchases</h4>
            <p className="text-3xl font-bold">{statsStatus === 'loading' ? <Skeleton width={60} /> : statistics?.total_purchases || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 flex flex-col items-center text-center w-full">
            <h4 className="text-lg mb-2">Total Sales</h4>
            <p className="text-3xl font-bold">{statsStatus === 'loading' ? <Skeleton width={60} /> : ('$' + statistics?.total_sales) || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 flex flex-col items-center text-center w-full">
            <h4 className="text-lg mb-2">Today Sales</h4>
            <p className="text-3xl font-bold">{statsStatus === 'loading' ? <Skeleton width={60} /> : ('$' + statistics?.today_sales) || 0}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Charts */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Sales Overview</h3>
          <div className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 w-full">
            {statsStatus === 'loading' ? (
              <Skeleton height={400} />
            ) : (
              <Line data={getDailySalesData()} />
            )}
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Sales by Medication</h3>
          <div className="bg-white rounded-lg shadow-sm shadow-teal-800 p-4 w-full">
            {statsStatus === 'loading' ? (
              <Skeleton height={400} />
            ) : (
              <Bar data={getSalesByMedicationData()} />
            )}
          </div>
        </div>
      </div>
      <ProfileUpdateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
