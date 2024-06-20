import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStaffByOrganization, updateUserStatus } from '../../redux/features/healthcareProviderSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import noDataImage from '../../assets/noData.png';
import defaultImage from '../../assets/default.jpg';
import CreateStaffModal from './CreateStaffModal';

const MyStaff = () => {
  const dispatch = useDispatch();
  const { staff, status } = useSelector((state) => state.healthcareProvider);
  const { user_info } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user_info?.organization_id) {
      dispatch(getStaffByOrganization(user_info.organization_id));
    }
  }, [dispatch, user_info]);

  useEffect(() => {    
    let filtered = staff;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((member) =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.icno.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((member) => member.status === statusFilter);
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter((member) => member.user_role === roleFilter);
    }

    setFilteredStaff(filtered);
  }, [staff, searchQuery, statusFilter, roleFilter]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleStatusToggle = (memberId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'terminated' : 'active';
    dispatch(updateUserStatus({ id: memberId, status: newStatus }));
  };

  const renderStaff = (member, index) => (
    <li
      key={index}
      className="flex flex-col sm:flex-row justify-center sm:justify-between items-center border-b border-t py-4"
    >
      <div className="flex items-center flex-col sm:flex-row justify-center w-full sm:w-auto">
        <img
          src={member.profile_img || defaultImage}
          alt={member.name}
          className="w-24 h-24 rounded-full sm:mr-4 mb-4 sm:mb-0"
        />
        <div className="justify-center text-center sm:text-left">
          <h4 className="text-sm sm:text-base font-semibold mb-2">{member.name}</h4>
          <p className="text-sm sm:text-base text-gray-600 mb-2"><strong>Tel: </strong>{member.contact}</p>
          <p className="text-sm sm:text-base text-gray-600 mb-2"><strong>Email: </strong>{member.email}</p>
          <p className="text-sm sm:text-base text-gray-600 mb-2"><strong>IC: </strong>{member.icno}</p>
        </div>
      </div>
      <div className="text-sm items-center flex flex-col mt-4 sm:mt-0">
        <span className="block text-gray-600 capitalize bg-gray-200 py-1 px-3 rounded mb-2"><strong>{member.user_role}</strong></span>
        <div className="flex flex-row">
          <button
            className={`py-1 px-2 rounded-l ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-300'} text-white`}
            onClick={() => handleStatusToggle(member.id, member.status)}
          >
            Active
          </button>
          <button
            className={`py-1 px-2 rounded-r ${member.status === 'terminated' ? 'bg-red-500' : 'bg-gray-300'} text-white`}
            onClick={() => handleStatusToggle(member.id, member.status)}
          >
            Terminated
          </button>
        </div>
      </div>
    </li>
  );

  return (
    <div className="flex flex-col p-5 md:p-9">
      <h3 className="text-xl md:text-2xl font-bold mb-6 text-center sm:text-left">My Staff</h3>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name, email, or IC..."
          className="p-2 w-full sm:w-auto flex-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="p-2 w-full sm:w-auto border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="terminated">Terminated</option>
        </select>
        <select
          value={roleFilter}
          onChange={handleRoleFilterChange}
          className="p-2 w-full sm:w-auto border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="all">All Roles</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="pharmacist">Pharmacist</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Create Staff
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 min-h-[200px]">
        <ul>
          {status === 'loading' ? (
            Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="flex justify-between items-center border-b py-2">
                <Skeleton width={200} height={20} />
              </li>
            ))
          ) : (
            Array.isArray(filteredStaff) && filteredStaff.length > 0 ? (
              filteredStaff.map((member, index) => renderStaff(member, index))
            ) : (
              <div className="flex flex-col items-center">
                <img src={noDataImage} alt="No Staff Found" className="w-32 h-32" />
                <span className="text-center text-gray-500 py-2">No Staff Found</span>
              </div>
            )
          )}
        </ul>
      </div>
      <CreateStaffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default MyStaff;
