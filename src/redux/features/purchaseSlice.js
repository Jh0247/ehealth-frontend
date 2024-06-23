import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/axiosSetup';
import { API_URL } from '../../statis/url';

const initialState = {
  statistics: null,
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
      });
  },
});

export const { resetState } = purchaseSlice.actions;
export default purchaseSlice.reducer;
