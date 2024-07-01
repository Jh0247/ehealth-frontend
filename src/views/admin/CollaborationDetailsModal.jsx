import React from 'react';
import PropTypes from 'prop-types';

const CollaborationDetailsModal = ({ isOpen, onClose, request, onApprove, onDecline }) => {
  if (!isOpen) return null;

  const handleApprove = () => {
    onApprove(request.users[0].id);
  };

  const handleDecline = () => {
    onDecline(request.users[0].id);
  };

  const getGoogleMapsLink = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-3xl w-full mx-2 sm:mx-auto">
        <div className="flex flex-row justify-between mb-4">
          <h3 className="text-lg font-bold">Collaboration Request Details</h3>
          <a className="bg-gray-500 text-white py-1 px-3 rounded text-sm sm:text-base" onClick={onClose}>X</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <p><strong className="capitalize w-24 inline-block text-sm sm:text-base">Name:</strong> {request.name}</p>
            <p><strong className="capitalize w-24 inline-block text-sm sm:text-base">Code:</strong> <a className="text-blue-500 underline" href={"https://www.ssm.com.my/Pages/e-Search.aspx"} target="_blank" rel="noopener noreferrer">{request.code}</a></p>
            <p className="capitalize"><strong className="capitalize w-24 inline-block text-sm sm:text-base">Type:</strong> {request.type}</p>
            <p><strong className="capitalize w-24 inline-block text-sm sm:text-base">Address:</strong> <a className="text-blue-500 underline" href={getGoogleMapsLink(request.address)} target="_blank" rel="noopener noreferrer">{request.address}</a></p>
          </div>
          <div>
            <p><strong className="capitalize w-24 inline-block text-sm sm:text-base">Latitude:</strong> {request.latitude}</p>
            <p><strong className="capitalize w-24 inline-block text-sm sm:text-base">Longitude:</strong> {request.longitude}</p>
            <p><strong className="capitalize w-24 inline-block text-sm sm:text-base">Created At:</strong> {new Date(request.created_at).toLocaleString()}</p>
            <p><strong className="capitalize w-24 inline-block text-sm sm:text-base">Updated At:</strong> {new Date(request.updated_at).toLocaleString()}</p>
          </div>
        </div>
        <h3 className="text-lg font-bold mt-4">Users</h3>
        <ul className="mb-4">
          {request.users.map((user) => (
            <li key={user.id} className="mb-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="capitalize"><strong className="capitalize w-24 inline-block text-sm sm:text-base">Name:</strong> {user.name}</p>
                  <p className="capitalize"><strong className="capitalize w-24 inline-block text-sm sm:text-base">Email:</strong> <a className="text-blue-500 underline" href={`mailto:${user.email}`}>{user.email}</a></p>
                </div>
                <div>
                  <p className="capitalize"><strong className="capitalize w-24 inline-block text-sm sm:text-base">Contact:</strong> <a className="text-blue-500 underline" href={`tel:${user.contact}`}>{user.contact}</a></p>
                  <p className="capitalize"><strong className="capitalize w-24 inline-block text-sm sm:text-base">IC No:</strong> {user.icno}</p>
                </div>
                <div>
                  <p className="capitalize"><strong className="capitalize w-24 inline-block text-sm sm:text-base">Role:</strong> {user.user_role}</p>
                  <p className="capitalize"><strong className="capitalize w-24 inline-block text-sm sm:text-base">Status:</strong> {user.status}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="bg-green-500 text-white py-1 px-3 rounded text-sm sm:text-base"
            onClick={handleApprove}
          >
            Approve
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded text-sm sm:text-base"
            onClick={handleDecline}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

CollaborationDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  request: PropTypes.object.isRequired,
  onApprove: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
};

export default CollaborationDetailsModal;
