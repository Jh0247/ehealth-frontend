export let API_BASE_URL = 'http://52.64.17.175:5173/api/';

export const API_URL = {
  LOGIN: API_BASE_URL + 'login',
  REGISTER: API_BASE_URL + 'user-register',
  COLLABORATION_REQUEST: API_BASE_URL + 'collaboration-request',
  GET_USER_HEALTH_RECORD: API_BASE_URL + 'user-health-record',
  GET_USER_APPOINTMENTS: API_BASE_URL + 'user-appointments',
  GET_USER_MEDICATIONS: API_BASE_URL + 'user-medications',
  UPDATE_USER_PROFILE: API_BASE_URL + 'update-profile',
  UPDATE_PASSWORD: API_BASE_URL + 'user/update-password',
  ORGANIZATION_LIST: API_BASE_URL + 'organization-list',
  ORGANIZATION: API_BASE_URL + 'organization',
  BOOK_APPOINTMENT: API_BASE_URL + 'book-appointment',
  APPOINTMENT: API_BASE_URL + 'appointment',
  BLOGPOSTS: API_BASE_URL + 'blogposts',
  PATIENTS_BY_APPOINTMENTS: API_BASE_URL + 'patients-by-appointments',
  ORGANIZATION_STATS: API_BASE_URL + 'organization-stats',
  USER: API_BASE_URL + 'user',
  STAFF_REGISTER: API_BASE_URL + 'staff-register',
  USER_BLOGPOSTS: API_BASE_URL + 'user/blogposts', 
  MEDICATIONS: API_BASE_URL + 'medications',
  ADMIN_BOOK_APPOINTMENT: API_BASE_URL + 'admin-book-appointment',
  SEARCH_USER: API_BASE_URL + 'search-user',
  HEALTH_RECORD: API_BASE_URL + 'health-record',
  PURCHASES: API_BASE_URL + 'purchases',
  USER_PURCHASES: API_BASE_URL + 'user-purchases',
  ADMIN_VIEW_ALL_ORGANIZATION: API_BASE_URL + 'admin-view-all-organization',
  STOP_COLLABORATION: API_BASE_URL + 'stop-collaboration',
  RECOLLABORATE: API_BASE_URL + 'recollaborate',
  STATISTIC_USER_REGISTRATIONS: API_BASE_URL + 'admin/statistics/user-registrations',
  STATISTIC_BLOGPOST_STATUS: API_BASE_URL + 'admin/statistics/blogpost-status',
  STATISTIC_APPOINTMENTS_BY_TYPE: API_BASE_URL + 'admin/statistics/appointments-by-type',
  STATISTIC_SALES_OVER_TIME: API_BASE_URL + 'admin/statistics/sales-over-time',
  STATISTIC_MEDICATIONS_SOLD: API_BASE_URL + 'admin/statistics/medications-sold',
  COLLABORATION_REQUESTS: API_BASE_URL + 'collaboration-requests',
  COLLABORATION_REQUEST_APPROVE: API_BASE_URL + 'collaboration-request/approve',
  COLLABORATION_REQUEST_DECLINE: API_BASE_URL + 'collaboration-request/decline',
};
