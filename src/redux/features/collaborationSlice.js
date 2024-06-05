import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/axiosSetup';
import { API_URL } from '../../statis/url';

const initialState = {
  status: 'idle',
  error: null,
};

export const createCollaborationRequest = createAsyncThunk(
  'collaboration/createCollaborationRequest',
  async (collaborationData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_URL.COLLABORATION_REQUEST, collaborationData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const collaborationSlice = createSlice({
  name: 'collaboration',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCollaborationRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCollaborationRequest.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createCollaborationRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default collaborationSlice.reducer;
