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

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_URL.UPDATE_USER_PROFILE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateUserHealthRecord = createAsyncThunk(
  'user/updateUserHealthRecord',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API_URL.HEALTH_RECORD}/${id}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchUserPurchases = createAsyncThunk(
  'user/fetchUserPurchases',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL.USER_PURCHASES);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  'user/updateUserPassword',
  async ({ current_password, new_password, new_password_confirmation }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(API_URL.UPDATE_PASSWORD, {
        current_password,
        new_password,
        new_password_confirmation,
      });
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
    resetUserStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getUserHealth
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
      // getUserAppointments
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
      // getUserMedications
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
      })
      // updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user_info = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateUserHealthRecord.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUserHealthRecord.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.health_record = action.payload;
        state.error = null;
      })
      .addCase(updateUserHealthRecord.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchUserPurchases.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserPurchases.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.purchases = action.payload;
        state.error = null;
      })
      .addCase(fetchUserPurchases.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateUserPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser, resetUserStatus } = userSlice.actions;

export default userSlice.reducer;
