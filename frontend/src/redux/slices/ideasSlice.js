import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Generate ideas
export const generateIdeas = createAsyncThunk(
  'ideas/generate',
  async (ideaData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/ideas/generate', ideaData);
      return response.data.ideas;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to generate ideas'
      );
    }
  }
);

// Get all ideas
export const getIdeas = createAsyncThunk(
  'ideas/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const { contentType, status, page = 1, limit = 10 } = params || {};
      
      let url = `/api/ideas?page=${page}&limit=${limit}`;
      if (contentType) url += `&contentType=${contentType}`;
      if (status) url += `&status=${status}`;

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch ideas'
      );
    }
  }
);

// Get idea by ID
export const getIdeaById = createAsyncThunk(
  'ideas/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/ideas/${id}`);
      return response.data.idea;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch idea'
      );
    }
  }
);

// Update idea
export const updateIdea = createAsyncThunk(
  'ideas/update',
  async ({ id, ideaData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/ideas/${id}`, ideaData);
      return response.data.idea;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update idea'
      );
    }
  }
);

// Delete idea
export const deleteIdea = createAsyncThunk(
  'ideas/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/ideas/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete idea'
      );
    }
  }
);

const initialState = {
  items: [],
  currentIdea: null,
  loading: false,
  generatingIdeas: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
};

const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    clearCurrentIdea: (state) => {
      state.currentIdea = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Ideas
      .addCase(generateIdeas.pending, (state) => {
        state.generatingIdeas = true;
        state.error = null;
      })
      .addCase(generateIdeas.fulfilled, (state, action) => {
        state.generatingIdeas = false;
        state.items = [...action.payload, ...state.items];
      })
      .addCase(generateIdeas.rejected, (state, action) => {
        state.generatingIdeas = false;
        state.error = action.payload;
      })
      
      // Get Ideas
      .addCase(getIdeas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIdeas.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.ideas;
        state.pagination = action.payload.pagination;
      })
      .addCase(getIdeas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Idea by ID
      .addCase(getIdeaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIdeaById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIdea = action.payload;
      })
      .addCase(getIdeaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Idea
      .addCase(updateIdea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIdea.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update in items array
        const index = state.items.findIndex(
          (idea) => idea._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        
        // Update current idea if it's the same one
        if (state.currentIdea && state.currentIdea._id === action.payload._id) {
          state.currentIdea = action.payload;
        }
      })
      .addCase(updateIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Idea
      .addCase(deleteIdea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((idea) => idea._id !== action.payload);
        if (state.currentIdea && state.currentIdea._id === action.payload) {
          state.currentIdea = null;
        }
      })
      .addCase(deleteIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentIdea, clearError } = ideasSlice.actions;

export default ideasSlice.reducer;