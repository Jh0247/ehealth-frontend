import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/axiosSetup';
import { API_URL } from '../../statis/url';

const initialState = {
  purchases: [],
  statistics: null,
  prescriptions: [],
  status: 'idle',
  error: null,
};

export const fetchPurchaseStatistics = createAsyncThunk(
  'purchase/fetchPurchaseStatistics',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL.ORGANIZATION}/${organizationId}/purchase-statistics`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchAllPurchasesByOrganization = createAsyncThunk(
  'purchase/fetchAllPurchasesByOrganization',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL.ORGANIZATION}/${organizationId}/purchases`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createPurchaseRecord = createAsyncThunk(
  'purchase/createPurchaseRecord',
  async (purchaseData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL.PURCHASES}`, purchaseData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deletePurchaseRecord = createAsyncThunk(
  'purchase/deletePurchaseRecord',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${API_URL.PURCHASES}/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchAppointmentPrescriptions = createAsyncThunk(
  'purchase/fetchAppointmentPrescriptions',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL.APPOINTMENT}/${appointmentId}/prescriptions`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseStatistics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPurchaseStatistics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.statistics = action.payload;
        state.error = null;
      })
      .addCase(fetchPurchaseStatistics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAllPurchasesByOrganization.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllPurchasesByOrganization.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.purchases = action.payload;
        state.error = null;
      })
      .addCase(fetchAllPurchasesByOrganization.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createPurchaseRecord.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPurchaseRecord.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.purchases.push(action.payload);
        state.error = null;
      })
      .addCase(createPurchaseRecord.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deletePurchaseRecord.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePurchaseRecord.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.purchases = state.purchases.filter(purchase => purchase.id !== action.meta.arg);
        state.error = null;
      })
      .addCase(deletePurchaseRecord.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAppointmentPrescriptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointmentPrescriptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.prescriptions = action.payload;
        state.error = null;
      })
      .addCase(fetchAppointmentPrescriptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetState } = purchaseSlice.actions;
export default purchaseSlice.reducer;
