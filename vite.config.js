import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          admin: [
            'src/views/admin/AdminDashboard.jsx',
            'src/views/admin/CollaborationDetailsModal.jsx',
            'src/views/admin/CreateMedicationModal.jsx',
            'src/views/admin/ManageBlogpost.jsx',
            'src/views/admin/ManageMedication.jsx',
            'src/views/admin/OrganizationList.jsx'
          ],
          common: [
            'src/views/common/Landing.jsx',
            'src/views/common/Login.jsx',
            'src/views/common/Register.jsx',
            'src/views/common/NotFound.jsx',
            'src/views/common/SignUpOrganization.jsx'
          ],
          healthcare: [
            'src/views/healthcare/CreateAppointmentModal.jsx',
            'src/views/healthcare/CreateStaffModal.jsx',
            'src/views/healthcare/CreationBlogpost.jsx',
            'src/views/healthcare/HealthcareDashboard.jsx',
            'src/views/healthcare/HealthRecordUpdateModal.jsx',
            'src/views/healthcare/MyBlogpost.jsx',
            'src/views/healthcare/MyPatients.jsx',
            'src/views/healthcare/MyStaff.jsx'
          ],
          patient: [
            'src/views/patient/BookAppointment.jsx',
            'src/views/patient/PatientDashboard.jsx',
            'src/views/patient/PurchaseRecord.jsx'
          ],
          pharmacist: [
            'src/views/pharmacist/AddMedication.jsx',
            'src/views/pharmacist/AddPurchaseRecord.jsx',
            'src/views/pharmacist/ManagePurchaseRecord.jsx',
            'src/views/pharmacist/PharmacistDashboard.jsx',
            'src/views/pharmacist/PrescriptionModal.jsx',
            'src/views/pharmacist/PurchaseModal.jsx'
          ],
          shared: [
            'src/views/shared/AppointmentList.jsx',
            'src/views/shared/BlogpostDetails.jsx',
            'src/views/shared/HealthRecord.jsx',
            'src/views/shared/MedicationDetailsModal.jsx',
            'src/views/shared/MedicationSelect.jsx',
            'src/views/shared/PrescriptionField.jsx',
            'src/views/shared/ProfileUpdateModal.jsx',
            'src/views/shared/UpdatePasswordModal.jsx',
            'src/views/shared/ViewAppointmentDetails.jsx',
            'src/views/shared/ViewBlogpost.jsx'
          ],
          redux: [
            'src/redux/features/appointmentSlice.js',
            'src/redux/features/authSlice.js',
            'src/redux/features/blogpostSlice.js',
            'src/redux/features/collaborationSlice.js',
            'src/redux/features/healthcareProviderSlice.js',
            'src/redux/features/loadingSlice.js',
            'src/redux/features/medicationSlice.js',
            'src/redux/features/organizationSlice.js',
            'src/redux/features/purchaseSlice.js',
            'src/redux/features/statisticsSlice.js',
            'src/redux/features/toastSlice.js',
            'src/redux/features/userSlice.js',
            'src/redux/middleware/axiosMiddleware.js',
            'src/redux/middleware/loadingMiddleware.js',
            'src/redux/presist/loadingTransform.js',
            'src/redux/store.js'
          ],
          components: [
            'src/components/Layout/AdminLayout.jsx',
            'src/components/Layout/GuestLayout.jsx',
            'src/components/Layout/HealthcareLayout.jsx',
            'src/components/Layout/PatientLayout.jsx',
            'src/components/Layout/PharmacistLayout.jsx',
            'src/components/JitsiMeeting.jsx',
            'src/components/Loading.jsx',
            'src/components/Navbar.jsx',
            'src/components/Sidebar.jsx',
            'src/components/Toast.jsx'
          ],
          constants: [
            'src/constants/healthData.js',
            'src/constants/rolePath.js'
          ],
          utils: [
            'src/Utils/axiosSetup.js',
            'src/statis/url.js'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
