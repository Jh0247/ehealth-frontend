let API_BASE_URL = 'http://localhost:8000/api/';

export const API_URL = {
  LOGIN: API_BASE_URL + 'login',
  REGISTER: API_BASE_URL + 'user-register',
  COLLABORATION_REQUEST: API_BASE_URL + 'collaboration-request',
  GET_USER_HEALTH_RECORD: API_BASE_URL + 'user-health-record',
  GET_USER_APPOINTMENTS: API_BASE_URL + 'user-appointments',
  GET_USER_MEDICATIONS: API_BASE_URL + 'user-medications',
  UPDATE_USER_PROFILE: API_BASE_URL + 'update-profile',
  ORGANIZATION_LIST: API_BASE_URL + 'organization-list',
  ORGANIZATION: API_BASE_URL + 'organization',
  BOOK_APPOINTMENT: API_BASE_URL + 'book-appointment',
  APPOINTMENT: API_BASE_URL + 'appointment',
  BLOGPOSTS: API_BASE_URL + 'blogposts',
  PATIENTS_BY_APPOINTMENTS: API_BASE_URL + 'patients-by-appointments',
  ORGANIZATION_STATS: API_BASE_URL + 'organization-stats',
};
