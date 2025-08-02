import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchWorkouts = createAsyncThunk(
  'workouts/fetch',
  async () => {
    try {
    const response = await api.get('/workouts');
      console.log('Fetch workouts response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch workouts error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const createWorkout = createAsyncThunk(
  'workouts/create',
  async (workoutData) => {
    try {
      console.log('Creating workout with data:', workoutData);
      const response = await api.post('/admin/workouts', workoutData);
      console.log('Create workout response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create workout error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const updateWorkout = createAsyncThunk(
  'workouts/update',
  async ({ id, workoutData }) => {
    try {
      console.log('Updating workout with data:', { id, workoutData });
      const response = await api.put(`/admin/workouts/${id}`, workoutData);
      console.log('Update workout response:', response.data);
    return response.data;
    } catch (error) {
      console.error('Update workout error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const deleteWorkout = createAsyncThunk(
  'workouts/delete',
  async (id) => {
    try {
      console.log('Deleting workout with id:', id);
      await api.delete(`/admin/workouts/${id}`);
      console.log('Delete workout successful');
      return id;
    } catch (error) {
      console.error('Delete workout error:', error.response?.data || error.message);
      throw error;
    }
  }
);

const initialState = {
  workouts: [],
  loading: false,
  error: null,
};

const workoutSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch workouts
      .addCase(fetchWorkouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.loading = false;
        state.workouts = action.payload;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create workout
      .addCase(createWorkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkout.fulfilled, (state, action) => {
        state.loading = false;
        state.workouts.push(action.payload);
      })
      .addCase(createWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update workout
      .addCase(updateWorkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkout.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workouts.findIndex(w => w.id === action.payload.id);
        if (index !== -1) {
          state.workouts[index] = action.payload;
        }
      })
      .addCase(updateWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete workout
      .addCase(deleteWorkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkout.fulfilled, (state, action) => {
        state.loading = false;
        state.workouts = state.workouts.filter(w => w.id !== action.payload);
      })
      .addCase(deleteWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = workoutSlice.actions;
export default workoutSlice.reducer;
