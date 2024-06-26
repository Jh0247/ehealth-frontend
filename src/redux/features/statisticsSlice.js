import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/axiosSetup';
import { API_URL } from '../../statis/url';

const initialState = {
  userRegistrations: [],
  blogpostStatus: [],
  appointmentsByType: [],
  salesOverTime: [],
  medicationsSold: [],
  status: 'idle',
  error: null,
};

export const fetchUserRegistrations = createAsyncThunk(
  'statistics/fetchUserRegistrations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL.STATISTIC_USER_REGISTRATIONS);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchBlogpostStatus = createAsyncThunk(
  'statistics/fetchBlogpostStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL.STATISTIC_BLOGPOST_STATUS);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchAppointmentsByType = createAsyncThunk(
  'statistics/fetchAppointmentsByType',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL.STATISTIC_APPOINTMENTS_BY_TYPE);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchSalesOverTime = createAsyncThunk(
  'statistics/fetchSalesOverTime',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL.STATISTIC_SALES_OVER_TIME);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchMedicationsSold = createAsyncThunk(
  'statistics/fetchMedicationsSold',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL.STATISTIC_MEDICATIONS_SOLD);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRegistrations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserRegistrations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userRegistrations = action.payload;
      })
      .addCase(fetchUserRegistrations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchBlogpostStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogpostStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blogpostStatus = action.payload;
      })
      .addCase(fetchBlogpostStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAppointmentsByType.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointmentsByType.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointmentsByType = action.payload;
      })
      .addCase(fetchAppointmentsByType.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchSalesOverTime.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSalesOverTime.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.salesOverTime = action.payload;
      })
      .addCase(fetchSalesOverTime.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMedicationsSold.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMedicationsSold.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.medicationsSold = action.payload;
      })
      .addCase(fetchMedicationsSold.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default statisticsSlice.reducer;
