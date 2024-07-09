import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPurchasesByOrganization, deletePurchaseRecord } from '../../redux/features/purchaseSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Icon } from '@iconify/react';
import arrowDown from '@iconify-icons/mdi/arrow-down';
import arrowUp from '@iconify-icons/mdi/arrow-up';

export default function ManagePurchaseRecord() {
  const dispatch = useDispatch();
  const { user_info } = useSelector((state) => state.user);
  const { purchases, status } = useSelector((state) => state.purchase);
  const [sortedPurchases, setSortedPurchases] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    if (user_info?.organization_id) {
      dispatch(fetchAllPurchasesByOrganization(user_info.organization_id));
    }
  }, [dispatch, user_info?.organization_id]);

  useEffect(() => {
    setSortedPurchases(purchases);
  }, [purchases]);

  const handleDeletePurchase = (id) => {
    dispatch(deletePurchaseRecord(id));
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedArray = [...purchases].sort((a, b) => {
      const aValue = key === 'user_name' ? a.user?.name ?? '' : a[key] ?? '';
      const bValue = key === 'user_name' ? b.user?.name ?? '' : b[key] ?? '';

      if (key === 'date_purchase') {
        return direction === 'ascending' ? new Date(aValue) - new Date(bValue) : new Date(bValue) - new Date(aValue);
      } else if (key === 'medication_name') {
        return direction === 'ascending'
          ? (a.medication?.name ?? '').localeCompare(b.medication?.name ?? '')
          : (b.medication?.name ?? '').localeCompare(a.medication?.name ?? '');
      } else if (key === 'user_name') {
        return direction === 'ascending'
          ? (a.user?.name ?? '').localeCompare(b.user?.name ?? '')
          : (b.user?.name ?? '').localeCompare(a.user?.name ?? '');
      } else {
        return direction === 'ascending'
          ? aValue - bValue
          : bValue - aValue;
      }
    });
    setSortedPurchases(sortedArray);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <Icon className="ml-2" icon={arrowUp} /> : <Icon className="ml-2" icon={arrowDown} />;
  };

  const renderPurchases = (purchasesList) => (
    <div className="bg-white rounded shadow-md shadow-teal-800 p-4 md:p-6">
      <div className="mt-4">
        <h4 className="font-bold mb-2">Purchase Records</h4>
        <div className="relative bg-gray-100 rounded-lg shadow-inner">
          <div className="sticky top-0 bg-gray-100 p-4 rounded-t-lg shadow-md">
            <div className="flex justify-between mb-2">
              <div className="flex flex-row w-1/6 cursor-pointer items-center" onClick={() => handleSort('id')}>
                <strong>Purchase ID</strong> {renderSortIcon('id')}
              </div>
              <div className="flex-row w-1/6 hidden sm:flex cursor-pointer items-center" onClick={() => handleSort('total_payment')}>
                <strong>Total Payment</strong> {renderSortIcon('total_payment')}
              </div>
              <div className="flex-row w-1/6 hidden sm:flex cursor-pointer items-center" onClick={() => handleSort('date_purchase')}>
                <strong>Date of Purchase</strong> {renderSortIcon('date_purchase')}
              </div>
              <div className="flex flex-row w-1/6 cursor-pointer items-center" onClick={() => handleSort('user_name')}>
                <strong>User</strong> {renderSortIcon('user_name')}
              </div>
              <div className="flex-row w-1/6 hidden sm:flex cursor-pointer items-center" onClick={() => handleSort('medication_name')}>
                <strong>Medication</strong> {renderSortIcon('medication_name')}
              </div>
              <div className="w-1/6"><strong>Action</strong></div>
            </div>
          </div>
          <ul className="max-h-[60vh] overflow-y-auto px-4 py-2">
            {status === 'loading' ? (
              Array.from({ length: 3 }).map((_, index) => (
                <li key={index} className="flex justify-between items-center border-b py-2">
                  <Skeleton width={200} height={20} />
                </li>
              ))
            ) : purchasesList.length > 0 ? (
              purchasesList.map((purchase, index) => (
                <li key={index} className="flex justify-between items-center border-b py-2">
                  <div className="w-1/6">{purchase.id ?? 'N/A'}</div>
                  <div className="w-1/6 hidden sm:block">{purchase.total_payment ?? 'N/A'}</div>
                  <div className="w-1/6 hidden sm:block">{purchase.date_purchase ? new Date(purchase.date_purchase).toLocaleDateString() : 'N/A'}</div>
                  <div className="w-1/6">{purchase.user?.name ?? 'N/A'}</div>
                  <div className="w-1/6 hidden sm:block">{purchase.medication?.name ?? 'N/A'}</div>
                  <div className="w-1/6">
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                      onClick={() => handleDeletePurchase(purchase.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="flex justify-between items-center border-b py-2">
                <p className="text-gray-500">No purchase records found.</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6">Manage Purchase Record</h3>
      {renderPurchases(sortedPurchases)}
    </div>
  );
}
