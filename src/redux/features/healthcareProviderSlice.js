import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/axiosSetup';
import { API_URL } from '../../statis/url';

const initialState = {
  patients: [],
  appointments: [],
  statistics: null,
  staff: [],
  status: 'idle',
  error: null,
};

export const getPatientsByDoctor = createAsyncThunk(
  'healthcareProvider/getPatientsByDoctor',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL.PATIENTS_BY_APPOINTMENTS);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getOrganizationStats = createAsyncThunk(
  'healthcareProvider/getOrganizationStats',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL.ORGANIZATION_STATS}/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getAppointmentsByOrganization = createAsyncThunk(
  'healthcareProvider/getAppointmentsByOrganization',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL.ORGANIZATION}/${organizationId}/appointments`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getStaffByOrganization = createAsyncThunk(
  'healthcareProvider/getStaffByOrganization',
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL.ORGANIZATION}/${organizationId}/users`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'healthcareProvider/updateUserStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API_URL.USER}/${id}/status`, { status });
      return { id, status };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const registerStaff = createAsyncThunk(
  'healthcareProvider/registerStaff',
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL.STAFF_REGISTER}`, staffData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const healthcareProviderSlice = createSlice({
  name: 'healthcareProvider',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPatientsByDoctor.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPatientsByDoctor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patients = action.payload;
        state.error = null;
      })
      .addCase(getPatientsByDoctor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getOrganizationStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOrganizationStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.statistics = action.payload;
        state.error = null;
      })
      .addCase(getOrganizationStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getAppointmentsByOrganization.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAppointmentsByOrganization.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointments = action.payload;
        state.error = null;
      })
      .addCase(getAppointmentsByOrganization.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getStaffByOrganization.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getStaffByOrganization.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.staff = action.payload;
        state.error = null;
      })
      .addCase(getStaffByOrganization.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const index = state.staff.findIndex((member) => member.id === id);
        if (index !== -1) {
          state.staff[index].status = status;
        }
      })
      .addCase(registerStaff.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerStaff.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.staff.push(action.payload.user);
        state.error = null;
      })
      .addCase(registerStaff.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetState } = healthcareProviderSlice.actions;
export default healthcareProviderSlice.reducer;
