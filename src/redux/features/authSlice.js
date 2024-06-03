import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/axiosSetup';
import { API_URL } from '../../statis/url';

const initialState = {
  token: '',
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('loginUser: Attempting login wdddith credentials:', credentials);
      const response = await axiosInstance.post(API_URL.LOGIN, credentials);
      console.log('loginUser: Login successful, response:', response);
      return response.data;
    } catch (err) {
      console.log('loginUser: Login failed, error:', err);
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        console.log('loginUser: Loading state');
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.access_token;
        state.error = null;
        console.log('loginUser: Succeeded state, payload:', action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.token = null;
        state.error = action.payload;
        console.log('loginUser: Failed state, error:', action.payload);
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
