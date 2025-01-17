import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/axiosSetup';
import { API_URL } from '../../statis/url';

const initialState = {
  appointment: null,
  status: 'idle',
  error: null,
};

export const bookAppointment = createAsyncThunk(
  'appointment/bookAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_URL.BOOK_APPOINTMENT, appointmentData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || err.message);
    }
  }
);

export const getAppointmentDetails = createAsyncThunk(
  'appointment/getAppointmentDetails',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL.APPOINTMENT}/${appointmentId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || err.message);
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointment/deleteAppointment',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${API_URL.APPOINTMENT}/${appointmentId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || err.message);
    }
  }
);

export const updateAppointmentWithPrescriptions = createAsyncThunk(
  'appointment/updateAppointmentWithPrescriptions',
  async ({ appointmentId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL.APPOINTMENT}/${appointmentId}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || err.message);
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointment/cancelAppointment',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API_URL.APPOINTMENT}/${appointmentId}/status`, { status: 'cancelled' });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || err.message);
    }
  }
);

export const searchUserByIcno = createAsyncThunk(
  'appointment/searchUserByIcno',
  async (icno, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL.SEARCH_USER}?icno=${icno}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || err.message);
    }
  }
);

export const adminBookAppointment = createAsyncThunk(
  'appointment/adminBookAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_URL.ADMIN_BOOK_APPOINTMENT, appointmentData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || err.message);
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    resetState: () => initialState,
    clearUserSearchResults: (state) => {
      state.userSearchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(bookAppointment.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getAppointmentDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAppointmentDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointment = action.payload;
        state.error = null;
      })
      .addCase(getAppointmentDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAppointment.fulfilled, (state) => {
        state.status = 'succeeded';
        state.appointment = null;
        state.error = null;
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateAppointmentWithPrescriptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAppointmentWithPrescriptions.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateAppointmentWithPrescriptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(cancelAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointment = action.payload;
        state.error = null;
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(searchUserByIcno.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchUserByIcno.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userSearchResults = action.payload;
        state.error = null;
      })
      .addCase(searchUserByIcno.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(adminBookAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(adminBookAppointment.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(adminBookAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetState, clearUserSearchResults } = appointmentSlice.actions;
export default appointmentSlice.reducer;
