import React, { useState } from 'react';

export default function SignUpOrganization() {
  const [organizationName, setOrganizationName] = useState('');
  const [organizationCode, setOrganizationCode] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminContact, setAdminContact] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  //Todo: organization sign up function
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Organization Name:', organizationName);
    console.log('Organization Code:', organizationCode);
    console.log('Admin Name:', adminName);
    console.log('Admin Contact:', adminContact);
    console.log('Admin Email:', adminEmail);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
  };

  const isFormValid = () => {
    return (
      organizationName &&
      organizationCode &&
      adminName &&
      adminContact &&
      adminEmail &&
      password &&
      confirmPassword &&
      termsAgreed
    );
  };

  return (
    <div className="bg-white p-1">
      <div className="flex justify-center">
        <div className="flex flex-col p-1">
          <form onSubmit={handleSubmit} className="mt-1 lg:mt-5 p-5 w-full sm:w-[600px]">
            <div className="text-2xl lg:text-3xl font-bold leading-10 text-zinc-900">
              Organization Collaboration
              <br />
              Request
            </div>
            <div className="flex flex-col justify-center mt-10 bg-opacity-0">
              <label className="font-bold text-gray-700">
                Organization Name
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="bg-gray-100 text-neutral-800 p-4 mt-1"
                placeholder="Organization Name here..."
              />
            </div>

            {/* to do: allow user to select new or old business code */}

            <div className="flex flex-col justify-center mt-5 bg-opacity-0">
              <label className="font-bold text-gray-700">
                Organization Register Code
              </label>
              <input
                type="text"
                value={organizationCode}
                onChange={(e) => setOrganizationCode(e.target.value)}
                className="bg-gray-100 text-neutral-800 p-4 mt-1"
                placeholder="Organization code here..."
                maxLength={15}
              />
            </div>
            <div className="flex flex-col justify-center mt-5 bg-opacity-0">
              <label className="font-bold text-gray-700">
                Admin Name
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="bg-gray-100 text-neutral-800 p-4 mt-2"
                placeholder="example@email.com"
              />
            </div>
            <div className="flex flex-col justify-center mt-5 bg-opacity-0">
              <label className="font-bold text-gray-700">
                Admin Contact
              </label>
              <input
                type="text"
                value={adminContact}
                onChange={(e) => setAdminContact(e.target.value)}
                className="bg-gray-100 text-neutral-800 p-4 mt-2"
                placeholder="example@email.com"
              />
            </div>
            <div className="flex flex-col justify-center mt-5 bg-opacity-0">
              <label className="font-bold text-gray-700">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="bg-gray-100 text-neutral-800 p-4 mt-2"
                placeholder="example@email.com"
              />
            </div>
            <div className="flex flex-col justify-center mt-5 bg-opacity-0">
              <label className="font-bold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-100 text-neutral-800 p-4 mt-2 w-full"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-center mt-5 bg-opacity-0">
              <label className="font-bold text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-100 text-neutral-800 p-4 mt-2 w-full"
                  placeholder="Retype password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-600"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-center mt-3.5 text-sm leading-5 text-zinc-900">
              <div className="flex gap-1.5 py-1 bg-opacity-0">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="w-4 h-4 bg-white border border-gray-600"
                />
                <div className="flex-auto">
                  By signing up, I agree with the Terms of Use & Privacy Policy
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`justify-center items-center p-4 mt-3.5 text-white ${
                isFormValid() ? 'bg-blue-600' : 'bg-blue-200 cursor-not-allowed'
              }`}
            >
              Request Collaboration
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
