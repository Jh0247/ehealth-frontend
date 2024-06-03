import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user_info: '',
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user_info = action.payload;
    },
    clearUser: (state) => {
      state.user_role = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;