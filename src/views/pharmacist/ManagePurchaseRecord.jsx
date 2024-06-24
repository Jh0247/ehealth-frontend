import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPurchasesByOrganization, deletePurchaseRecord } from '../../redux/features/purchaseSlice';
import { getAppointmentsByOrganization } from '../../redux/features/healthcareProviderSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ManagePurchaseRecord() {
  const dispatch = useDispatch();
  const { user_info } = useSelector((state) => state.user);
  const { purchases, status } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (user_info?.organization_id) {
      dispatch(fetchAllPurchasesByOrganization(user_info.organization_id));
    }
  }, [dispatch, user_info?.organization_id]);

  const handleDeletePurchase = (id) => {
    dispatch(deletePurchaseRecord(id));
  };

  const renderPurchases = (purchasesList) => (
    <div className="bg-white rounded shadow-md shadow-teal-800 p-4 md:p-6">
      <div className="mt-4">
        <h4 className="font-bold mb-2">Purchase Records</h4>
        <div className="relative bg-gray-100 rounded-lg shadow-inner">
          <div className="sticky top-0 bg-gray-100 p-4 rounded-t-lg shadow-md">
            <div className="flex justify-between mb-2">
              <div className="w-1/6"><strong>Purchase ID</strong></div>
              <div className="w-1/6 hidden sm:block"><strong>Total Payment</strong></div>
              <div className="w-1/6 hidden sm:block"><strong>Date of Purchase</strong></div>
              <div className="w-1/6"><strong>User</strong></div>
              <div className="w-1/6 hidden sm:block"><strong>Medication</strong></div>
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
                  <div className="w-1/6">{purchase.id}</div>
                  <div className="w-1/6 hidden sm:block">{purchase.total_payment}</div>
                  <div className="w-1/6 hidden sm:block">{new Date(purchase.date_purchase).toLocaleDateString()}</div>
                  <div className="w-1/6">{purchase.user?.name || 'N/A'}</div>
                  <div className="w-1/6 hidden sm:block">{purchase.medication?.name || 'N/A'}</div>
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
      {renderPurchases(purchases)}
    </div>
  );
}
