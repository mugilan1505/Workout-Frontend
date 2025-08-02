import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem, Chip, Container
} from '@mui/material';
import { 
  Add as AddIcon, TrendingUp as TrendingUpIcon, CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon, FitnessCenter as FitnessIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProgress, fetchAllProgress, createProgress, clearError } from '../redux/slices/progressSlice';
import { fetchWorkouts } from '../redux/slices/workoutSlice';
import { fetchUsers } from '../redux/slices/userSlice';

const Progress = () => {
  const dispatch = useDispatch();
  const { userProgress, allProgress, loading, error } = useSelector((state) => state.progress);
  const { workouts } = useSelector((state) => state.workouts);
  const { users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);
  
  // Remove unused variables to fix ESLint warnings
  // users is fetched for admin but not used directly in this component
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [formData, setFormData] = useState({
    workoutId: '', completed: true, date: new Date().toISOString().split('T')[0],
    durationMinutes: 30, caloriesBurned: 200, notes: ''
  });
  
  const handleViewDetails = (progress) => {
    setSelectedProgress(progress);
  };
  
  const handleCloseDetails = () => {
    setSelectedProgress(null);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAdmin) {
          await dispatch(fetchAllProgress());
          await dispatch(fetchUsers());
        } else if (user?.id) {
          await dispatch(fetchUserProgress(user.id));
        }
        await dispatch(fetchWorkouts());
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, [dispatch, user?.id, isAdmin]);

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
  }, [error, dispatch]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      workoutId: '', completed: true, date: new Date().toISOString().split('T')[0],
      durationMinutes: 30, caloriesBurned: 200, notes: ''
    });
  };

  const handleSubmit = async () => {
    if (formData.workoutId) {
      try {
        const selectedWorkout = workouts.find(w => w.id === formData.workoutId);
        
        // Create the progress with all necessary data
        const progressData = {
          ...formData,
          userId: user.id,
          workout: selectedWorkout,
          user: { id: user.id, username: user.username } // Include minimal user data
        };
        
        await dispatch(createProgress(progressData));
        
        // Refresh the progress data to ensure UI is in sync with the database
        if (isAdmin) {
          await dispatch(fetchAllProgress());
        } else {
          // Add a small delay to ensure the backend has processed the request
          setTimeout(async () => {
            await dispatch(fetchUserProgress(user.id));
          }, 300);
        }
        
        handleCloseDialog();
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box className="modern-home-container">
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress sx={{ color: '#ff6b35' }} />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="modern-home-container">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h3" className="modern-title">Progress Dashboard</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog} className="modern-button">
              Mark Workout Complete
            </Button>
          </Box>
          <Typography variant="body1" className="modern-text">Track your fitness journey and monitor your achievements</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

        {/* Main Content */}
        <Card className="modern-card">
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" className="modern-title" gutterBottom>
              {isAdmin ? 'User Workout Completions' : 'Your Progress'}
            </Typography>
            
            {isAdmin ? (
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <th style={{ textAlign: 'left', padding: '12px' }}>User</th>
                      <th style={{ textAlign: 'center', padding: '12px' }}>Stats</th>
                      <th style={{ textAlign: 'right', padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProgress.length > 0 ? (
                      allProgress.map((progress) => (
                        <tr key={progress.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '12px' }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {progress.user?.username || 'Unknown User'}
                            </Typography>
                          </td>
                          <td style={{ textAlign: 'center', padding: '12px' }}>
                            <Chip label={progress.completed ? 'Completed' : 'Incomplete'} color={progress.completed ? 'success' : 'warning'} />
                          </td>
                          <td style={{ textAlign: 'right', padding: '12px' }}>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              onClick={() => handleViewDetails(progress)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', padding: '24px' }}>
                          <ScheduleIcon sx={{ fontSize: 48, color: '#ff6b35', mb: 2, opacity: 0.5 }} />
                          <Typography variant="h6" className="modern-title" gutterBottom>
                            No Workout Completions Yet
                          </Typography>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {userProgress.length > 0 ? (
                  userProgress.slice(0, 6).map((progress) => (
                    <Grid item xs={12} sm={6} md={4} key={progress.id}>
                      <Card className="modern-card hover-lift" variant="outlined">
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {progress.workout?.name || 'Unknown Workout'}
                            </Typography>
                            <Chip
                              label={progress.completed ? 'Completed' : 'Incomplete'}
                              color={progress.completed ? 'success' : 'warning'}
                              size="small"
                            />
                          </Box>
                          <Box mb={1}>
                            <Typography variant="body2">
                              <strong>Date:</strong> {new Date(progress.date).toLocaleDateString()}
                            </Typography>
                            {progress.durationMinutes && (
                              <Typography variant="body2">
                                <strong>Duration:</strong> {progress.durationMinutes} min
                              </Typography>
                            )}
                            {progress.caloriesBurned && (
                              <Typography variant="body2">
                                <strong>Calories:</strong> {progress.caloriesBurned} kcal
                              </Typography>
                            )}
                          </Box>
                          {progress.notes && (
                            <Box mt={1} p={1} bgcolor="#f5f5f5" borderRadius={1}>
                              <Typography variant="body2" color="textSecondary">
                                <em>"{progress.notes}"</em>
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box textAlign="center" py={4} width="100%">
                      <ScheduleIcon sx={{ fontSize: 64, color: '#ff6b35', mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" className="modern-title" gutterBottom>
                        No Progress Yet
                      </Typography>
                      <Typography variant="body1" className="modern-text">
                        Start tracking your workouts to see your progress here!
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Add Progress Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Log Workout Completion</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Workout</InputLabel>
                <Select
                  value={formData.workoutId}
                  label="Workout"
                  onChange={(e) => setFormData({ ...formData, workoutId: e.target.value })}
                >
                  {workouts.map((workout) => (
                    <MenuItem key={workout.id} value={workout.id}>
                      {workout.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                inputProps={{ min: 1, max: 1000 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Calories Burned"
                value={formData.caloriesBurned}
                onChange={(e) => setFormData({ ...formData, caloriesBurned: parseInt(e.target.value) || 0 })}
                inputProps={{ min: 1, max: 10000 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                placeholder="How did it go? Any notes about your workout?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="error" variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!formData.workoutId || !formData.date}
            startIcon={<CheckCircleIcon />}
          >
            Save Workout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Progress Details Dialog */}
      <Dialog 
        open={!!selectedProgress} 
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
      >
        {selectedProgress && (
          <>
            <DialogTitle>Workout Completion Details</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {selectedProgress.workout?.name || 'Unknown Workout'}
                  </Typography>
                  <Box mb={2}>
                    <Chip 
                      label={selectedProgress.completed ? 'Completed' : 'Incomplete'} 
                      color={selectedProgress.completed ? 'success' : 'warning'} 
                      size="small"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">User</Typography>
                  <Typography variant="body1">
                    {selectedProgress.user?.username || 'Unknown User'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Date</Typography>
                  <Typography variant="body1">
                    {new Date(selectedProgress.date).toLocaleDateString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Duration</Typography>
                  <Typography variant="body1">
                    {selectedProgress.durationMinutes || 'N/A'} minutes
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Calories Burned</Typography>
                  <Typography variant="body1">
                    {selectedProgress.caloriesBurned || 'N/A'} kcal
                  </Typography>
                </Grid>
                
                {selectedProgress.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                      {selectedProgress.notes}
                    </Typography>
                  </Grid>
                )}
                
                {selectedProgress.workout && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Workout Details
                    </Typography>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {selectedProgress.workout.name}
                        </Typography>
                        {selectedProgress.workout.description && (
                          <Typography variant="body2" color="textSecondary" paragraph>
                            {selectedProgress.workout.description}
                          </Typography>
                        )}
                        <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
                          <Chip 
                            size="small" 
                            label={`${selectedProgress.workout.duration || 'N/A'} min`} 
                            variant="outlined"
                          />
                          <Chip 
                            size="small" 
                            label={`${selectedProgress.workout.difficulty || 'N/A'}`} 
                            variant="outlined"
                          />
                          <Chip 
                            size="small" 
                            label={`${selectedProgress.workout.category || 'N/A'}`} 
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDetails} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Progress;
