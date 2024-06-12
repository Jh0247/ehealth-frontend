import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/axiosSetup';
import { API_URL } from '../../statis/url';

const initialState = {
  user_info: '',
  health_record: {},
  appointments: [],
  medications: [],
  status: 'idle',
  error: null,
};

export const getUserHealth = createAsyncThunk(
  'user/getUserHealth',
  async (userId, { rejectWithValue }) => {
    try {
      const url = userId ? `${API_URL.GET_USER_HEALTH_RECORD}/${userId}` : API_URL.GET_USER_HEALTH_RECORD;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUserAppointments = createAsyncThunk(
  'user/getUserAppointments',
  async (userId, { rejectWithValue }) => {
    try {
      const url = userId ? `${API_URL.GET_USER_APPOINTMENTS}/${userId}` : API_URL.GET_USER_APPOINTMENTS;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUserMedications = createAsyncThunk(
  'user/getUserMedications',
  async (userId, { rejectWithValue }) => {
    try {
      const url = userId ? `${API_URL.GET_USER_MEDICATIONS}/${userId}` : API_URL.GET_USER_MEDICATIONS;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user_info = action.payload;
    },
    clearUser: (state) => {
      return initialState; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserHealth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUserHealth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.health_record = action.payload;
        state.error = null;
      })
      .addCase(getUserHealth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getUserAppointments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUserAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointments = action.payload;
        state.error = null;
      })
      .addCase(getUserAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getUserMedications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUserMedications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.medications = action.payload;
        state.error = null;
      })
      .addCase(getUserMedications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
