import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get content calendar
export const getCalendarEvents = createAsyncThunk(
  'calendar/getEvents',
  async ({ month, year } = {}, { rejectWithValue }) => {
    try {
      let url = '/api/calendar';
      
      // Add query parameters if provided
      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }
      
      const response = await axios.get(url);
      return response.data.calendar;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch calendar events'
      );
    }
  }
);

const initialState = {
  events: [],
  loading: false,
  error: null,
  selectedDate: null,
  activeMonth: new Date().getMonth() + 1, // 1-12
  activeYear: new Date().getFullYear(),
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setActiveMonth: (state, action) => {
      state.activeMonth = action.payload;
    },
    setActiveYear: (state, action) => {
      state.activeYear = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCalendarEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCalendarEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getCalendarEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedDate,
  setActiveMonth,
  setActiveYear,
  clearError,
} = calendarSlice.actions;

export default calendarSlice.reducer;