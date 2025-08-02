import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchUserProgress = createAsyncThunk(
  'progress/fetchUser',
  async (userId) => {
    try {
      const response = await api.get(`/progress/user/${userId}`);
      console.log('Fetch user progress response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch user progress error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const fetchAllProgress = createAsyncThunk(
  'progress/fetchAll',
  async () => {
    try {
      const response = await api.get('/admin/progress');
      console.log('Fetch all progress response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch all progress error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const fetchAllProgressDetailed = createAsyncThunk(
  'progress/fetchAllDetailed',
  async () => {
    try {
      const response = await api.get('/admin/progress/detailed');
      console.log('Fetch detailed progress response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch detailed progress error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const createProgress = createAsyncThunk(
  'progress/create',
  async (progressData) => {
    try {
      console.log('Creating progress with data:', progressData);
      const response = await api.post('/progress/complete-workout', progressData);
      console.log('Create progress response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create progress error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const updateProgress = createAsyncThunk(
  'progress/update',
  async ({ id, progressData }) => {
    try {
      console.log('Updating progress with data:', { id, progressData });
      const response = await api.put(`/progress/${id}`, progressData);
      console.log('Update progress response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update progress error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const deleteProgress = createAsyncThunk(
  'progress/delete',
  async (id) => {
    try {
      console.log('Deleting progress with id:', id);
      await api.delete(`/progress/${id}`);
      console.log('Delete progress successful');
      return id;
    } catch (error) {
      console.error('Delete progress error:', error.response?.data || error.message);
      throw error;
    }
  }
);

const initialState = {
  userProgress: [],
  allProgress: [],
  detailedProgress: [],
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserProgress: (state) => {
      state.userProgress = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user progress
      .addCase(fetchUserProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.userProgress = action.payload;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch all progress (admin)
      .addCase(fetchAllProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.allProgress = action.payload;
      })
      .addCase(fetchAllProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch detailed progress (admin)
      .addCase(fetchAllProgressDetailed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProgressDetailed.fulfilled, (state, action) => {
        state.loading = false;
        state.detailedProgress = action.payload;
      })
      .addCase(fetchAllProgressDetailed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create progress
      .addCase(createProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.userProgress.push(action.payload);
      })
      .addCase(createProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update progress
      .addCase(updateProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.userProgress.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.userProgress[index] = action.payload;
        }
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete progress
      .addCase(deleteProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.userProgress = state.userProgress.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearUserProgress } = progressSlice.actions;
export default progressSlice.reducer;
