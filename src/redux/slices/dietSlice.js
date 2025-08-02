import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDiets = createAsyncThunk(
  'diets/fetch',
  async () => {
    try {
    const response = await api.get('/dietplans');
      console.log('Fetch diets response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch diets error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const createDiet = createAsyncThunk(
  'diets/create',
  async (dietData) => {
    try {
      console.log('Creating diet with data:', dietData);
      const response = await api.post('/admin/dietplans', dietData);
      console.log('Create diet response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create diet error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const updateDiet = createAsyncThunk(
  'diets/update',
  async ({ id, dietData }) => {
    try {
      console.log('Updating diet with data:', { id, dietData });
      const response = await api.put(`/admin/dietplans/${id}`, dietData);
      console.log('Update diet response:', response.data);
    return response.data;
    } catch (error) {
      console.error('Update diet error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const deleteDiet = createAsyncThunk(
  'diets/delete',
  async (id) => {
    try {
      console.log('Deleting diet with id:', id);
      await api.delete(`/admin/dietplans/${id}`);
      console.log('Delete diet successful');
      return id;
    } catch (error) {
      console.error('Delete diet error:', error.response?.data || error.message);
      throw error;
    }
  }
);

const initialState = {
  diets: [],
  loading: false,
  error: null,
};

const dietSlice = createSlice({
  name: 'diets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch diets
      .addCase(fetchDiets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiets.fulfilled, (state, action) => {
        state.loading = false;
        state.diets = action.payload;
      })
      .addCase(fetchDiets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create diet
      .addCase(createDiet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDiet.fulfilled, (state, action) => {
        state.loading = false;
        state.diets.push(action.payload);
      })
      .addCase(createDiet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update diet
      .addCase(updateDiet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDiet.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.diets.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.diets[index] = action.payload;
        }
      })
      .addCase(updateDiet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete diet
      .addCase(deleteDiet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDiet.fulfilled, (state, action) => {
        state.loading = false;
        state.diets = state.diets.filter(d => d.id !== action.payload);
      })
      .addCase(deleteDiet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = dietSlice.actions;
export default dietSlice.reducer;
