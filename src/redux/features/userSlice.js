import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/axiosSetup';

const initialState = {
  user_role: '',
  token: '',
  user_info: '',
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('loginUser: Attempting login with credentials:', credentials);
      const response = await axiosInstance.post('/login', credentials);
      console.log('loginUser: Login successful, response:', response);
      return response.data;
    } catch (err) {
      console.log('loginUser: Login failed, error:', err);
      return rejectWithValue(err.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user_role = '';
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
        state.user_role = action.payload.user.user_role;
        state.token = action.payload.access_token;
        state.user_info = action.payload.user;
        console.log('loginUser: Succeeded state, payload:', action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.log('loginUser: Failed state, error:', action.payload);
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;