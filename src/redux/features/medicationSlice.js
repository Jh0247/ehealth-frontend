import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Utils/axiosSetup';
import { API_URL } from '../../statis/url';

const initialState = {
  medications: [],
  medicationDetails: null,
  status: 'idle',
  error: null,
};

export const fetchMedications = createAsyncThunk(
  'medication/fetchMedications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL.MEDICATIONS);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchMedicationDetails = createAsyncThunk(
  'medication/fetchMedicationDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL.MEDICATIONS}/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createMedication = createAsyncThunk(
  'medication/createMedication',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_URL.MEDICATIONS, formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const medicationSlice = createSlice({
  name: 'medication',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.medications = action.payload;
        state.error = null;
      })
      .addCase(fetchMedications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMedicationDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMedicationDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.medicationDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchMedicationDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createMedication.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createMedication.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.medications.push(action.payload.medication);
        state.error = null;
      })
      .addCase(createMedication.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetState } = medicationSlice.actions;
export default medicationSlice.reducer;
