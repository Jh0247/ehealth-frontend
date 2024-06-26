import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/axiosSetup';
import { API_URL } from '../../statis/url';

const initialState = {
  requests: [],
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

export const stopCollaboration = createAsyncThunk(
  'collaboration/stopCollaboration',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_URL.STOP_COLLABORATION, { organization_id: organizationId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const recollaborate = createAsyncThunk(
  'collaboration/recollaborate',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_URL.RECOLLABORATE, { organization_id: organizationId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getCollaborationRequests = createAsyncThunk(
  'collaboration/getCollaborationRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL.COLLABORATION_REQUESTS);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const approveCollaborationRequest = createAsyncThunk(
  'collaboration/approveCollaborationRequest',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL.COLLABORATION_REQUEST_APPROVE}/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const declineCollaborationRequest = createAsyncThunk(
  'collaboration/declineCollaborationRequest',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL.COLLABORATION_REQUEST_DECLINE}/${userId}`);
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
      })
      .addCase(stopCollaboration.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(stopCollaboration.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(stopCollaboration.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(recollaborate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(recollaborate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(recollaborate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getCollaborationRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCollaborationRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.requests = action.payload;
      })
      .addCase(getCollaborationRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(approveCollaborationRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(approveCollaborationRequest.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(approveCollaborationRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(declineCollaborationRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(declineCollaborationRequest.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(declineCollaborationRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default collaborationSlice.reducer;
