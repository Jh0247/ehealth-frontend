import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/axiosSetup';
import { API_URL } from '../../statis/url';

const initialState = {
  blogposts: [],
  blogpost: null,
  status: 'idle',
  error: null,
};

export const fetchBlogposts = createAsyncThunk(
  'blogpost/fetchBlogposts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL.BLOGPOSTS);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchBlogpostById = createAsyncThunk(
  'blogpost/fetchBlogpostById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL.BLOGPOSTS}/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchBlogpostsByName = createAsyncThunk(
  'blogpost/fetchBlogpostsByName',
  async (name, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL.BLOGPOSTS}/search/${name}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const blogpostSlice = createSlice({
  name: 'blogpost',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogposts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogposts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blogposts = action.payload;
        state.error = null;
      })
      .addCase(fetchBlogposts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchBlogpostById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogpostById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blogpost = action.payload;
        state.error = null;
      })
      .addCase(fetchBlogpostById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchBlogpostsByName.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogpostsByName.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blogposts = action.payload;
        state.error = null;
      })
      .addCase(fetchBlogpostsByName.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetState } = blogpostSlice.actions;
export default blogpostSlice.reducer;