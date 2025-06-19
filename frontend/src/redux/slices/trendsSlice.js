import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get trending topics
export const getTrends = createAsyncThunk(
  'trends/getTrends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/trends');
      return response.data.trends;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch trends'
      );
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const trendsSlice = createSlice({
  name: 'trends',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = trendsSlice.actions;

export default trendsSlice.reducer;