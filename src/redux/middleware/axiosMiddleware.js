import { popToast, ToastType } from "../features/toastSlice";

export const axiosMiddleware = ({ dispatch }) => (next) => async (action) => {
  if (action.type.endsWith('/rejected')) {
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
  } else if (action.type.endsWith('/fulfilled')) {
    dispatch(popToast({
      title: action.payload?.title || 'Success',
      message: action.payload?.message || 'Success!',
      type: ToastType.SUCCESS,
    }));
  }

  return next(action);
};