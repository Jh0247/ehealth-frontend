import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminViewAllOrganization } from '../../redux/features/organizationSlice';
import { stopCollaboration, recollaborate } from '../../redux/features/collaborationSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Icon } from '@iconify/react';
import arrowDown from '@iconify-icons/mdi/arrow-down';
import arrowUp from '@iconify-icons/mdi/arrow-up';

const OrganizationList = () => {
  const dispatch = useDispatch();
  const { organizations, status } = useSelector((state) => state.organization);
  const [selectedOrganization, setSelectedOrganization] = useState([]);
  const [sortedOrganizations, setSortedOrganizations] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    dispatch(getAdminViewAllOrganization());
  }, [dispatch]);

  useEffect(() => {
    if (organizations?.length > 0) {
      sortData(organizations, sortConfig.key, sortConfig.direction);
    }
  }, [organizations, sortConfig]);

  const sortData = (data, key, direction) => {
    const sortedArray = [...data].sort((a, b) => {
      if (key === 'name') {
        return direction === 'ascending'
          ? a.organization[key].localeCompare(b.organization[key])
          : b.organization[key].localeCompare(a.organization[key]);
      }
      return 0;
    });
    setSortedOrganizations(sortedArray);
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    setSortConfig({ key, direction });
    sortData(organizations, key, direction);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <Icon className="ml-2" icon={arrowUp} /> : <Icon className="ml-2" icon={arrowDown} />;
  };

  const filteredOrganizations = sortedOrganizations.filter(org => {
    return org.organization.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterType === '' || org.organization.type === filterType);
  });

  const toggleOrganizationDetails = (index) => {
    if (selectedOrganization.includes(index)) {
      setSelectedOrganization(selectedOrganization.filter(i => i !== index));
    } else {
      setSelectedOrganization([...selectedOrganization, index]);
    }
  };

  const handleStopCollaboration = async (organizationId) => {
    await dispatch(stopCollaboration(organizationId));
    dispatch(getAdminViewAllOrganization());
  };

  const handleRecollaborate = async (organizationId) => {
    await dispatch(recollaborate(organizationId));
    dispatch(getAdminViewAllOrganization());
  };

  return (
    <div className="flex flex-col p-5 md:p-9">
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between">
        <h3 className="text-xl md:text-2xl font-bold mb-6">Organization List</h3>
      </div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full sm:w-1/4"
          >
            <option value="">All Types</option>
            {Array.from(new Set(organizations.map(org => org.organization.type))).map(type => (
              <option key={type} value={type} className="capitalize">{type}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="relative bg-gray-100 rounded-lg shadow-inner">
        <div className="sticky top-0 bg-gray-100 p-4 rounded-t-lg shadow-md">
          <div className="flex justify-between mb-2">
            <div className="w-2/4 sm:w-1/4 text-sm sm:text-base cursor-pointer flex flex-row items-center capitalize" onClick={() => handleSort('name')}>
              <strong>Name</strong> {renderSortIcon('name')}
            </div>
            <div className="hidden sm:flex w-1/4 sm:text-base capitalize">
              <strong>Type</strong>
            </div>
            <div className="hidden sm:flex w-1/4 sm:text-base capitalize">
              <strong>Admin</strong>
            </div>
            <div className="w-2/4 sm:w-1/4 text-sm sm:text-base capitalize">
              <strong>Collaboration Status</strong>
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
          ) : filteredOrganizations.length > 0 ? (
            filteredOrganizations.map((org, index) => (
              <React.Fragment key={org.organization.id}>
                <li
                  onClick={() => toggleOrganizationDetails(index)}
                  className="flex justify-between items-center border-b py-2 cursor-pointer"
                >
                  <div className="flex w-full my-2">
                    <div className="flex flex-col w-2/4 sm:w-1/4 border-r-2 border-gray-300 pr-2">
                      <span className="text-sm sm:text-base my-1 md:my-0">
                        {org.organization.name}
                      </span>
                    </div>
                    <div className="hidden sm:flex w-1/4 border-r-2 border-gray-300 px-2">
                      <span className="text-sm sm:text-base my-1 md:my-0 capitalize">
                        {org.organization.type} Organization
                      </span>
                    </div>
                    <div className="hidden sm:flex w-1/4 border-r-2 border-gray-300 px-2">
                      <span className="text-sm sm:text-base my-1 md:my-0">
                        {org.first_admin ? org.first_admin.name : 'N/A'}
                      </span>
                    </div>
                    <div className={`w-2/4 sm:w-1/4 border-r-2 border-gray-300 px-2 ${org?.first_admin?.status === 'terminated' ? 'bg-red-200 text-red-800' : org?.first_admin?.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-100'}`}>
                      <span className="text-sm sm:text-base my-1 md:my-0 capitalize">
                        {org?.first_admin ? org?.first_admin?.status : 'N/A'}
                      </span>
                    </div>
                    <div className="hidden sm:flex border-r-2 border-gray-300 px-2 items-center justify-center">
                      <Icon icon={selectedOrganization.includes(index) ? arrowUp : arrowDown} />
                    </div>
                  </div>
                </li>
                {selectedOrganization.includes(index) && (
                  <li className="py-2 sm:px-4 border-b bg-gray-100">
                    <div className="flex flex-col lg:flex-row lg:justify-between sm:p-2">
                      <div className="lg:w-1/3 flex flex-col">
                        <div className="flex mb-1 justify-between lg:justify-normal">
                          <p className="font-bold sm:w-32">Admin: </p>
                          <p>{org.first_admin ? org.first_admin.name : 'N/A'}</p>
                        </div>
                        <div className="flex mb-1 justify-between lg:justify-normal">
                          <p className="font-bold sm:w-32">Email:</p>
                          <p>{org.first_admin ? org.first_admin.email : 'N/A'}</p>
                        </div>
                        <div className="flex mb-1 justify-between lg:justify-normal">
                          <p className="font-bold sm:w-32">Contact:</p>
                          <p>{org.first_admin ? org.first_admin.contact : 'N/A'}</p>
                        </div>
                      </div>
                      <div className="lg:w-1/3 flex flex-col">
                        <div className="flex mb-1 justify-between lg:justify-normal">
                          <p className="font-bold w-32">Staff Count:</p>
                          <p>{org.stats.num_staffs}</p>
                        </div>
                        <div className="flex mb-1 justify-between lg:justify-normal">
                          <p className="font-bold w-32">Appointments:</p>
                          <p>{org.stats.num_appointments}</p>
                        </div>
                        <div className="flex mb-1 justify-between lg:justify-normal">
                          <p className="font-bold w-32">Blog Posts:</p>
                          <p>{org.stats.num_blogposts}</p>
                        </div>
                      </div>
                      <div className="lg:w-1/3 flex flex-col">
                        <div className="flex flex-col mb-1 justify-between lg:justify-normal">
                          <p className="font-bold w-32">Address:</p>
                          <p>{org.organization.address}</p>
                        </div>
                        {org.first_admin.status !== 'terminated' ?
                          <button
                            onClick={() => handleStopCollaboration(org.organization.id)}
                            className="py-2 px-4 rounded mb-5 bg-red-500 hover:bg-red-600 text-white"
                          >
                            End partnership
                          </button>
                        : 
                        <button
                          onClick={() => handleRecollaborate(org.organization.id)}
                          className="py-2 px-4 rounded mb-5 bg-green-500 hover:bg-green-600 text-white"
                        >
                          Collaborate
                        </button>
                        }
                      </div>
                    </div>
                  </li>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-center text-gray-500 py-2">No Organizations Found</span>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default OrganizationList;
