import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import MedicationDetailsModal from '../shared/MedicationDetailsModal';
import { fetchMedicationDetails } from '../../redux/features/medicationSlice';
import { fetchUserPurchases } from '../../redux/features/userSlice'; 
import { Icon } from '@iconify/react';
import arrowDown from '@iconify-icons/mdi/arrow-down';
import arrowUp from '@iconify-icons/mdi/arrow-up';

const PurchaseRecord = () => {
  const dispatch = useDispatch();
  const { purchases = [], status } = useSelector((state) => state.user);
  const [sortedPurchases, setSortedPurchases] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date_purchase', direction: 'descending' });
  const [medicationModalOpen, setMedicationModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserPurchases());
  }, [dispatch]);

  useEffect(() => {
    if (purchases.length > 0) {
      handleSort('date_purchase', 'descending');
    }
  }, [purchases]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewDetails = (id) => {
    dispatch(fetchMedicationDetails(id)).then(() => {
      setMedicationModalOpen(true);
    });
  };

  const handleSort = (key, direction) => {
    if (!direction) {
      direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }
    setSortConfig({ key, direction });

    const sortedArray = [...purchases].sort((a, b) => {
      if (key === 'date_purchase') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === 'ascending' ? dateA - dateB : dateB - dateA;
      } else if (key === 'medication_name') {
        return direction === 'ascending'
          ? a.medication.name.localeCompare(b.medication.name)
          : b.medication.name.localeCompare(a.medication.name);
      } else {
        return direction === 'ascending'
          ? a[key] - b[key]
          : b[key] - a[key];
      }
    });
    setSortedPurchases(sortedArray);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <Icon className="ml-2" icon={arrowUp} /> : <Icon className="ml-2" icon={arrowDown} />;
  };

  const renderPurchase = (purchase, index) => (
    <li
      onClick={() => handleViewDetails(purchase?.medication_id)}
      key={index}
      className="flex justify-between items-center border-b py-2 cursor-pointer"
    >
      <div className="flex w-full my-2">
        <div className="flex flex-col w-2/4 sm:w-1/4 border-r-2 border-gray-300 pr-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            <strong>Date: </strong> {formatDate(purchase.date_purchase)}
          </span>
        </div>
        <div className="flex flex-col w-2/4 border-r-2 border-gray-300 px-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            <strong>Name: </strong> {purchase.medication.name}
          </span>
        </div>
        <div className="hidden sm:flex flex-col w-1/4 border-r-2 border-gray-300 px-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            <strong>Quantity: </strong> {purchase.quantity}
          </span>
        </div>
        <div className="hidden sm:flex w-1/4 items-center px-2">
          <span className="text-sm sm:text-base my-1 md:my-0">
            <strong>Total Payment: </strong> ${purchase.total_payment}
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
            <div className="flex flex-row w-2/4 sm:w-1/4 sm:text-base cursor-pointer items-center" onClick={() => handleSort('date_purchase')}>
              <strong>Date  </strong>{renderSortIcon('date_purchase')}
            </div>
            <div className="flex flex-row w-2/4 sm:text-base cursor-pointer items-center" onClick={() => handleSort('medication_name')}>
              <strong>Name  </strong> {renderSortIcon('medication_name')}
            </div>
            <div className="flex-row hidden sm:flex w-1/4 sm:text-base cursor-pointer items-center" onClick={() => handleSort('quantity')}>
              <strong>Quantity  </strong> {renderSortIcon('quantity')}
            </div>
            <div className="flex-row hidden sm:flex w-1/4 sm:text-base cursor-pointer items-center" onClick={() => handleSort('total_payment')}>
              <strong>Total Payment  </strong> {renderSortIcon('total_payment')}
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
          ) : sortedPurchases.length > 0 ? (
            sortedPurchases.map((purchase, index) => renderPurchase(purchase, index))
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
