import { popToast, ToastType } from "../features/toastSlice";

const includeToastsForActions = [
  'auth/loginUser/fulfilled',
  'auth/loginUser/rejected',
  'auth/registerUser/fulfilled',
  'auth/registerUser/rejected',
  'collaboration/createCollaborationRequest/fulfilled',
  'collaboration/createCollaborationRequest/rejected',
  'appointment/bookAppointment/rejected',
  'blogpost/updateBlogpost/fulfilled',
  'blogpost/updateBlogpost/rejected',
  'healthcareProvider/registerStaff/fulfilled',
  'healthcareProvider/registerStaff/rejected',
  'user/updateUserPassword/fulfilled',
];

export const axiosMiddleware = ({ dispatch }) => (next) => async (action) => {
  if (action.type.endsWith('/rejected')  && includeToastsForActions.includes(action.type)) {
    let errorMessages = action.payload;
    if (typeof errorMessages === 'string') {
      try {
        errorMessages = JSON.parse(errorMessages);
      } catch (e) {
        // console.error("Failed to parse error message:", e);
      }
    }
  
    const errorMessage = errorMessages
      ? Object.values(errorMessages).flat().join(' ')
      : 'An error occurred!';
  
    dispatch(popToast({
      title: 'Error',
      message: errorMessage,
      type: ToastType.ERROR,
    }));
  } else if (action.type.endsWith('/fulfilled') && includeToastsForActions.includes(action.type)) {
    dispatch(popToast({
      title: action.payload?.title || 'Success',
      message: action.payload?.message || 'Success!',
      type: ToastType.SUCCESS,
    }));
  }

  return next(action);
};
