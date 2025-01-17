import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/axiosSetup';
import { API_URL } from '../../statis/url';

const initialState = {
  blogpost: null,
  status: 'idle',
  error: null,
};

export const fetchBlogpost = createAsyncThunk(
  'blogpost/fetchBlogpost',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL.BLOGPOSTS, { params });
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

export const fetchUserBlogpost = createAsyncThunk(
  'blogpost/fetchUserBlogpost',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL.USER_BLOGPOSTS);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createBlogpost = createAsyncThunk(
  'blogpost/createBlogpost',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_URL.BLOGPOSTS, formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateBlogpost = createAsyncThunk(
  'blogpost/updateBlogpost',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL.BLOGPOSTS}/${id}`, formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteBlogpost = createAsyncThunk(
  'blogpost/deleteBlogpost',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${API_URL.BLOGPOSTS}/${id}`);
      return { id };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateBlogpostStatus = createAsyncThunk(
  'blogpostStatus/updateBlogpostStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API_URL.BLOGPOSTS}/${id}/status`, { status });
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
      .addCase(fetchBlogpost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogpost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blogpost = action.payload;
        state.error = null;
      })
      .addCase(fetchBlogpost.rejected, (state, action) => {
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
        state.blogpost = action.payload;
        state.error = null;
      })
      .addCase(fetchBlogpostsByName.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchUserBlogpost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserBlogpost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blogpost = action.payload;
        state.error = null;
      })
      .addCase(fetchUserBlogpost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createBlogpost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBlogpost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blogpost = action.payload;
        state.error = null;
      })
      .addCase(createBlogpost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateBlogpost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateBlogpost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateBlogpost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteBlogpost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteBlogpost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(deleteBlogpost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateBlogpostStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateBlogpostStatus.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateBlogpostStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetState } = blogpostSlice.actions;
export default blogpostSlice.reducer;
