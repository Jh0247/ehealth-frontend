import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: false,
  reducers: {
    start: () => true,
    stop: () => false,
  },
});

export const { start, stop } = loadingSlice.actions;

export default loadingSlice.reducer;
