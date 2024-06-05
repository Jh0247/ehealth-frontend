import { createSlice } from "@reduxjs/toolkit";

const ToastType = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

const initialState = {
  open: false,
  title: '',
  message: '',
  type: ToastType.INFO,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    popToast: (state, action) => {
      state.open = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideToast: (state) => {
      state.open = false;
      state.title = null;
      state.message = null;
      state.type = ToastType.INFO;
    },
  },
});

export { ToastType };

export const { popToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;