import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Workouts from '../pages/Workouts';
import WorkoutDetails from '../pages/WorkoutDetails';
import Progress from '../pages/Progress';
import AdminDashboard from '../pages/AdminDashboard';
import UserProgressReports from '../pages/UserProgressReports';
import Diets from '../pages/Diets';
import { Box } from '@mui/material';
import '../styles/Layout.css';

const Layout = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    return user?.roles?.includes('ROLE_ADMIN') ? children : <Navigate to="/" />;
  };

  // Redirect admin users from home page to admin dashboard
  const HomePageWrapper = () => {
    if (user?.roles?.includes('ROLE_ADMIN')) {
      return <Navigate to="/admin/dashboard" />;
    }
    return <HomePage />;
  };

  return (
    <Router>
      <div className="layout-container">
        <Navbar className="layout-navbar" user={user} handleLogout={handleLogout} />
        <Box className="layout-content">
          <Routes>
            <Route path="/" element={<HomePageWrapper />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/workouts"
              element={
                <PrivateRoute>
                  <Workouts />
                </PrivateRoute>
              }
            />
            <Route
              path="/workout/:id"
              element={
                <PrivateRoute>
                  <WorkoutDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <PrivateRoute>
                  <Progress />
                </PrivateRoute>
              }
            />
            <Route
              path="/diets"
              element={
                <PrivateRoute>
                  <Diets />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/progress/reports"
              element={
                <PrivateRoute>
                  <UserProgressReports />
                </PrivateRoute>
              }
            />
          </Routes>
        </Box>
      </div>
    </Router>
  );
};

export default Layout;
