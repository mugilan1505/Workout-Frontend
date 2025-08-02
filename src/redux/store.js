import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workoutReducer from './slices/workoutSlice';
import dietReducer from './slices/dietSlice';
import progressReducer from './slices/progressSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    workouts: workoutReducer,
    diets: dietReducer,
    progress: progressReducer,
    users: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['auth.token'],
        ignoredActions: ['auth/loginSuccess', 'auth/registerSuccess']
      }
    })
});

export default store;
