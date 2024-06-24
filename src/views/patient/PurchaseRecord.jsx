import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import MedicationDetailsModal from '../shared/MedicationDetailsModal';
import { fetchMedicationDetails } from '../../redux/features/medicationSlice';
import { fetchUserPurchases } from '../../redux/features/userSlice'; 

const PurchaseRecord = () => {
  const dispatch = useDispatch();
  const { purchases = [], status } = useSelector((state) => state.user);
  const [medicationModalOpen, setMedicationModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserPurchases());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewDetails = (id) => {
    dispatch(fetchMedicationDetails(id)).then(() => {
      setMedicationModalOpen(true);
    });
  };

  const renderPurchase = (purchase, index) => (
    <li
      onClick={() => handleViewDetails(purchase?.medication_id)}
      key={index}
      className="flex justify-between items-center border-b py-2"
    >
      <div className="flex w-full my-2">
        <div className="flex flex-col w-2/4 sm:w-1/4 border-r-2 border-gray-300 pr-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            <strong></strong> {formatDate(purchase.date_purchase)}
          </span>
        </div>
        <div className="flex flex-col w-2/4 border-r-2 border-gray-300 px-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            <strong></strong> {purchase.medication.name}
          </span>
        </div>
        <div className="hidden sm:flex flex-col w-1/4 border-r-2 border-gray-300 px-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            <strong></strong> {purchase.quantity}
          </span>
        </div>
        <div className="hidden sm:flex w-1/4 items-center px-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            <strong></strong> ${purchase.total_payment}
          </span>
        </div>
      </div>
    </li>
  );

  return (
    <div className="flex flex-col p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6">Purchase Records</h3>
      <div className="relative bg-gray-100 rounded-lg shadow-inner">
        <div className="sticky top-0 bg-gray-100 p-4 rounded-t-lg shadow-md">
          <div className="flex justify-between mb-2">
            <div className="w-2/4 sm:w-1/4 sm:text-base"><strong>Date</strong></div>
            <div className="w-2/4 sm:text-base"><strong>Name</strong></div>
            <div className="hidden sm:block w-1/4 sm:text-base"><strong>Quantity</strong></div>
            <div className="hidden sm:block w-1/4 sm:text-base"><strong>Total Payment</strong></div>
          </div>
        </div>
        <ul className="max-h-[70vh] overflow-y-auto px-4 py-2">
          {status === 'loading' ? (
            Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="flex justify-between items-center border-b py-2">
                <Skeleton width={200} height={20} />
              </li>
            ))
          ) : purchases.length > 0 ? (
            purchases.map((purchase, index) => renderPurchase(purchase, index))
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-center text-gray-500 py-2">No Purchase Records Found</span>
            </div>
          )}
        </ul>
      </div>
      <MedicationDetailsModal
        isOpen={medicationModalOpen}
        onClose={() => setMedicationModalOpen(false)}
      />
    </div>
  );
};

export default PurchaseRecord;