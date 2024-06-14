import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/axiosSetup';
import { API_URL } from '../../statis/url';

const initialState = {
  organizations: [],
  locations: [],
  users: [],
  status: 'idle',
  error: null,
};

export const getOrganizationList = createAsyncThunk(
  'organization/getOrganizationList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL.ORGANIZATION_LIST);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getOrganizationDetails = createAsyncThunk(
  'organization/getOrganizationDetails',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL.ORGANIZATION}/${organizationId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUsersByOrganization = createAsyncThunk(
  'organization/getUsersByOrganization',
  async ({ organizationId, role }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL.ORGANIZATION}/${organizationId}/users/${role}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrganizationList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOrganizationList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.organizations = action.payload;
      })
      .addCase(getOrganizationList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getOrganizationDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOrganizationDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.locations = action.payload.locations;
      })
      .addCase(getOrganizationDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getUsersByOrganization.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUsersByOrganization.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(getUsersByOrganization.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default organizationSlice.reducer;
