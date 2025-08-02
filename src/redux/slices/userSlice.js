import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async () => {
    try {
      const response = await api.get('/users');
      console.log('Fetch all users response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch all users error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'users/fetch',
  async () => {
    try {
      const response = await api.get('/users');
      console.log('Fetch users response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch users error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, userData }) => {
    try {
      console.log('Updating user with data:', { id, userData });
      const response = await api.put(`/admin/users/${id}`, userData);
      console.log('Update user response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id) => {
    try {
      console.log('Deleting user with id:', id);
      await api.delete(`/admin/users/${id}`);
      console.log('Delete user successful');
      return id;
    } catch (error) {
      console.error('Delete user error:', error.response?.data || error.message);
      throw error;
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(u => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer; 