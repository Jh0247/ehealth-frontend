import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import emailIcon from '@iconify-icons/mdi/email';
import lockIcon from '@iconify-icons/mdi/lock';
import eyeIcon from '@iconify-icons/mdi/eye';
import eyeOffIcon from '@iconify-icons/mdi/eye-off';
import accountIcon from '@iconify-icons/mdi/account';
import phoneIcon from '@iconify-icons/mdi/phone';
import organizationIcon from '@iconify-icons/mdi/office-building';
import { useDispatch } from 'react-redux';
import { createCollaborationRequest } from '../../redux/features/collaborationSlice';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SignUpOrganization = () => {
  const dispatch = useDispatch();

  const [organizationName, setOrganizationName] = useState('');
  const [organizationCode, setOrganizationCode] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminContact, setAdminContact] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminIcno, setAdminIcno] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNewCode, setIsNewCode] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      createCollaborationRequest({
        organization_name: organizationName,
        organization_code: organizationCode,
        organization_type: isNewCode ? 'new' : 'old',
        admin_name: adminName,
        admin_email: adminEmail,
        admin_contact: adminContact,
        admin_icno: adminIcno,
        password,
        password_confirmation: confirmPassword,
        address,
        latitude,
        longitude
      })
    );

    if (result.type === 'collaboration/createCollaborationRequest/fulfilled') {
      resetField();
    }
  };

  const isFormValid = () => {
    return (
      organizationName &&
      organizationCode &&
      adminName &&
      adminContact &&
      adminEmail &&
      adminIcno &&
      password &&
      confirmPassword &&
      address &&
      latitude &&
      longitude
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const resetField = () => {
    setOrganizationName('');
    setOrganizationCode('');
    setAdminName('');
    setAdminContact('');
    setAdminEmail('');
    setAdminIcno('');
    setPassword('');
    setConfirmPassword('');
    setAddress('');
    setLatitude(null);
    setLongitude(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsNewCode(true);
  }

  const fetchAddress = async (lat, lon) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await response.json();
    return data.display_name;
  }

  const LocationMarker = () => {
    const map = useMapEvents({
      async click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
        const fetchedAddress = await fetchAddress(e.latlng.lat, e.latlng.lng);
        setAddress(fetchedAddress);
      }
    });

    return latitude && longitude ? (
      <Marker position={[latitude, longitude]} />
    ) : null;
  }

  return (
    <div className="flex justify-center md:items-center min-h-screen bg-cover bg-center bg-wave">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl mt-14 md:mt-10 mb-5 mx-2 h-fit bg-opacity-90">
        <h2 className="text-2xl font-bold text-[#347576] mb-6 text-center md:text-left">Organization Collaboration Request</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="mb-6">
            <label htmlFor="organizationName" className="block text-gray-700">Organization Name</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={organizationIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type="text" 
                id="organizationName" 
                className="w-full outline-none" 
                value={organizationName} 
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder='Organization Name here...'
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="organizationCodeType" className="block text-gray-700">Organization Register Code Type</label>
            <div className="flex items-center">
              <input 
                type="radio" 
                id="newCode" 
                name="codeType" 
                className="mr-2" 
                checked={isNewCode} 
                onChange={() => setIsNewCode(true)}
              />
              <label htmlFor="newCode" className="mr-4">New</label>
              <input 
                type="radio" 
                id="oldCode" 
                name="codeType" 
                className="mr-2" 
                checked={!isNewCode} 
                onChange={() => setIsNewCode(false)}
              />
              <label htmlFor="oldCode">Old</label>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="organizationCode" className="block text-gray-700">Organization Register Code</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={organizationIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type="text" 
                id="organizationCode" 
                className="w-full outline-none" 
                value={organizationCode} 
                onChange={(e) => setOrganizationCode(e.target.value)}
                placeholder={isNewCode ? '202001012345' : '123456-M'}
                maxLength={15}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="adminName" className="block text-gray-700">Admin Name</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={accountIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type="text" 
                id="adminName" 
                className="w-full outline-none" 
                value={adminName} 
                onChange={(e) => setAdminName(e.target.value)}
                placeholder='Admin Name here...'
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="adminContact" className="block text-gray-700">Admin Contact</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={phoneIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type="text" 
                id="adminContact" 
                className="w-full outline-none" 
                value={adminContact} 
                onChange={(e) => setAdminContact(e.target.value)}
                placeholder='012-3456789'
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="adminEmail" className="block text-gray-700">Admin Email</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={emailIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type="email" 
                id="adminEmail" 
                className="w-full outline-none" 
                value={adminEmail} 
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder='example@email.com'
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="adminIcno" className="block text-gray-700">Admin IC Number</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={accountIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type="text" 
                id="adminIcno" 
                className="w-full outline-none" 
                value={adminIcno} 
                onChange={(e) => setAdminIcno(e.target.value)}
                placeholder='Admin IC Number here...'
                required
              />
            </div>
          </div>
          <div className="mb-6 relative col-span-1 md:col-span-2">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={lockIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                className="w-full outline-none pr-10" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder='********'
                required
              />
              <button 
                type="button" 
                className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                <Icon icon={showPassword ? eyeOffIcon : eyeIcon} className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="mb-6 relative col-span-1 md:col-span-2">
            <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
            <div className="flex items-center border bg-white rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Icon icon={lockIcon} className="w-6 h-6 text-gray-400 mr-2" />
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                id="confirmPassword" 
                className="w-full outline-none pr-10" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='********'
                required
              />
              <button 
                type="button" 
                className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={toggleConfirmPasswordVisibility}
              >
                <Icon icon={showConfirmPassword ? eyeOffIcon : eyeIcon} className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="mb-6 col-span-1 md:col-span-2">
            <label className="block text-gray-700">Select Location</label>
            <MapContainer center={[3.0555128358382975, 101.69090544860869]} zoom={13} className="h-64 w-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
            </MapContainer>
            {address && (
              <div className="mt-2 text-gray-700">
                <p>Selected Address: {address}</p>
                <p>Latitude: {latitude}</p>
                <p>Longitude: {longitude}</p>
              </div>
            )}
          </div>
          <div className="col-span-1 md:col-span-2">
            <button 
              type="submit" 
              className={`w-full py-2 px-4 ${
                isFormValid() ? 'bg-[#347576]' : 'bg-gray-400'
              } text-white rounded hover:bg-[#285D5E] focus:outline-none focus:ring-2 focus:ring-[#63D4D5]`}
              disabled={!isFormValid()}
            >
              Request Collaboration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpOrganization;