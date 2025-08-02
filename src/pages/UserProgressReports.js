import React, { useEffect, useState } from 'react';
import '../styles/UserProgressReports.css';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  FitnessCenter as FitnessIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllUsers } from '../redux/slices/userSlice';
import { fetchAllProgress } from '../redux/slices/progressSlice';
import { fetchWorkouts } from '../redux/slices/workoutSlice';

const UserProgressReports = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWorkout, setFilterWorkout] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  // Get data from Redux store
  const users = useSelector((state) => state.users?.users || []);
  const allProgress = useSelector((state) => state.progress?.allProgress || []);
  const workouts = useSelector((state) => state.workouts?.workouts || []);
  const loading = useSelector((state) => state.progress?.loading || false);
  const error = useSelector((state) => state.progress?.error || null);

  useEffect(() => {
    // Fetch all data when component mounts
    dispatch(fetchAllUsers());
    dispatch(fetchAllProgress());
    dispatch(fetchWorkouts());
  }, [dispatch]);

  // Calculate user statistics
  const getUserStats = (userId) => {
    const userProgress = allProgress.filter(p => p.user?.id === userId);
    const totalWorkouts = userProgress.length;
    const completedWorkouts = userProgress.filter(p => p.completed).length;
    const completionRate = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
    
    return {
      totalWorkouts,
      completedWorkouts,
      completionRate,
      progress: userProgress
    };
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get paginated users
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterWorkout('all');
    setFilterUser('all');
  };

  // Filter progress entries for selected user
  const getFilteredUserProgress = (userId) => {
    let userProgress = allProgress.filter(p => p.user?.id === userId);
    
    if (filterStatus !== 'all') {
      userProgress = userProgress.filter(p => 
        filterStatus === 'completed' ? p.completed : !p.completed
      );
    }
    
    if (filterWorkout !== 'all') {
      userProgress = userProgress.filter(p => 
        p.workout?.id?.toString() === filterWorkout
      );
    }
    
    return userProgress.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  if (loading) {
    return (
      <Box className="user-progress-reports-container">
        <Box className="user-progress-reports-content">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress sx={{ color: '#ff6b35' }} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="user-progress-reports-container">
      <Box className="user-progress-reports-content">
        {/* Header */}
        <Box className="user-progress-reports-header">
          <Typography variant="h3" className="user-progress-reports-title">
        User Progress Reports
      </Typography>
          <Typography variant="body1" className="user-progress-reports-subtitle">
            Monitor user workout completion and track individual progress
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Search and Filters */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box display="flex" gap={2}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="incomplete">Incomplete</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>User</InputLabel>
                  <Select
                    value={filterUser}
                    label="User"
                    onChange={(e) => setFilterUser(e.target.value)}
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id.toString()}>
                        {user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Workout</InputLabel>
                  <Select
                    value={filterWorkout}
                    label="Workout"
                    onChange={(e) => setFilterWorkout(e.target.value)}
                  >
                    <MenuItem value="all">All Workouts</MenuItem>
                    {workouts.map((workout) => (
                      <MenuItem key={workout.id} value={workout.id.toString()}>
                        {workout.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<FilterIcon />}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  Clear Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="user-progress-reports-stat-card">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <PersonIcon sx={{ fontSize: 48, color: '#ff6b35', mb: 2 }} />
                <Typography variant="h4" className="user-progress-reports-stat-value">
                  {users.length}
                </Typography>
                <Typography variant="body2" className="user-progress-reports-stat-label">
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="user-progress-reports-stat-card">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <FitnessIcon sx={{ fontSize: 48, color: '#f7931e', mb: 2 }} />
                <Typography variant="h4" className="user-progress-reports-stat-value">
                  {allProgress.length}
                </Typography>
                <Typography variant="body2" className="user-progress-reports-stat-label">
                  Total Workout Entries
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="user-progress-reports-stat-card">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 48, color: '#27ae60', mb: 2 }} />
                <Typography variant="h4" className="user-progress-reports-stat-value">
                  {allProgress.filter(p => p.completed).length}
                </Typography>
                <Typography variant="body2" className="user-progress-reports-stat-label">
                  Completed Workouts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="user-progress-reports-stat-card">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <ScheduleIcon sx={{ fontSize: 48, color: '#3498db', mb: 2 }} />
                <Typography variant="h4" className="user-progress-reports-stat-value">
                  {workouts.length}
                </Typography>
                <Typography variant="body2" className="user-progress-reports-stat-label">
                  Available Workouts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* All User Workout Completions */}
        <Card className="user-progress-reports-table-section" sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" className="user-progress-reports-table-title">
                All User Workout Completions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Showing {allProgress
                  .filter(progress => {
                    if (filterUser !== 'all' && progress.user?.id?.toString() !== filterUser) return false;
                    if (filterStatus !== 'all') {
                      const isCompleted = filterStatus === 'completed';
                      if (progress.completed !== isCompleted) return false;
                    }
                    if (filterWorkout !== 'all' && progress.workout?.id?.toString() !== filterWorkout) return false;
                    return true;
                  }).length} of {allProgress.length} entries
              </Typography>
            </Box>
            
            <TableContainer>
              <Table className="user-progress-reports-table">
                <TableHead className="user-progress-reports-table-header">
                  <TableRow>
                    <TableCell className="user-progress-reports-table-header-cell">User</TableCell>
                    <TableCell className="user-progress-reports-table-header-cell" align="center">Workout</TableCell>
                    <TableCell className="user-progress-reports-table-header-cell" align="center">Date</TableCell>
                    <TableCell className="user-progress-reports-table-header-cell" align="center">Status</TableCell>
                    <TableCell className="user-progress-reports-table-header-cell" align="center">Duration</TableCell>
                    <TableCell className="user-progress-reports-table-header-cell" align="center">Calories</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allProgress
                    .filter(progress => {
                      if (filterUser !== 'all' && progress.user?.id?.toString() !== filterUser) return false;
                      if (filterStatus !== 'all') {
                        const isCompleted = filterStatus === 'completed';
                        if (progress.completed !== isCompleted) return false;
                      }
                      if (filterWorkout !== 'all' && progress.workout?.id?.toString() !== filterWorkout) return false;
                      return true;
                    })
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((progress) => {
                    const workout = progress.workout;
                    const user = progress.user;
                    return (
                      <TableRow key={progress.id} className="user-progress-reports-table-row">
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <PersonIcon sx={{ color: '#ff6b35' }} />
                            <Typography variant="body1" fontWeight="600">
                              {user?.username || 'Unknown User'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                            <FitnessIcon sx={{ color: '#f7931e', fontSize: 20 }} />
                            <Typography variant="body1" fontWeight="500">
                              {workout?.name || 'Unknown Workout'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          {new Date(progress.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={progress.completed ? 'Completed' : 'Incomplete'}
                            sx={{
                              backgroundColor: progress.completed ? '#27ae60' : '#f7931e',
                              color: 'white',
                              fontWeight: '600'
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {workout?.duration ? `${workout.duration} min` : 'N/A'}
                        </TableCell>
                        <TableCell align="center">
                          {workout?.calories ? `${workout.calories} cal` : 'N/A'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {allProgress.length === 0 && (
              <Box textAlign="center" py={4}>
                <ScheduleIcon sx={{ fontSize: 64, color: '#ff6b35', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
                  No Workout Completions Yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  No users have completed any workouts yet.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="user-progress-reports-table-section">
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" className="user-progress-reports-table-title" gutterBottom>
              User Progress Overview
            </Typography>
            
            <TableContainer>
              <Table className="user-progress-reports-table">
                <TableHead className="user-progress-reports-table-header">
                  <TableRow>
                    <TableCell className="user-progress-reports-table-header-cell">User</TableCell>
                    <TableCell className="user-progress-reports-table-header-cell" align="center">Email</TableCell>
                    <TableCell className="user-progress-reports-table-header-cell" align="center">Total Workouts</TableCell>
                    <TableCell className="user-progress-reports-table-header-cell" align="center">Completed</TableCell>
                    <TableCell className="user-progress-reports-table-header-cell" align="center">Success Rate</TableCell>
                    <TableCell className="user-progress-reports-table-header-cell" align="center">Last Activity</TableCell>
                    <TableCell className="user-progress-reports-table-header-cell" align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => {
                    const stats = getUserStats(user.id);
                    const lastActivity = stats.progress.length > 0 
                      ? new Date(Math.max(...stats.progress.map(p => new Date(p.date))))
                      : null;
                    
                    return (
                      <TableRow key={user.id} className="user-progress-reports-table-row">
                      <TableCell component="th" scope="row">
                          <Box display="flex" alignItems="center" gap={1}>
                            <PersonIcon sx={{ color: '#ff6b35' }} />
                            <Typography variant="body1" fontWeight="600">
                        {user.username}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">{user.email}</TableCell>
                        <TableCell align="center">
                          <Typography variant="body1" fontWeight="600">
                            {stats.totalWorkouts}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={stats.completedWorkouts}
                            sx={{
                              backgroundColor: '#27ae60',
                              color: 'white',
                              fontWeight: '600'
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body1" fontWeight="600" color="#ff6b35">
                            {stats.completionRate}%
                          </Typography>
                      </TableCell>
                        <TableCell align="center">
                          {lastActivity ? (
                            <Typography variant="body2" color="text.secondary">
                              {lastActivity.toLocaleDateString()}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No activity
                            </Typography>
                          )}
                      </TableCell>
                        <TableCell align="center">
                        <Button
                          variant="outlined"
                          onClick={() => handleUserClick(user)}
                            className="user-progress-reports-filter-button"
                            size="small"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={Math.ceil(filteredUsers.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>

            {paginatedUsers.length === 0 && (
              <Box textAlign="center" py={4}>
                <PersonIcon sx={{ fontSize: 64, color: '#ff6b35', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Users Found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No users are registered yet.'}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

      {/* User Details Dialog */}
      <Dialog
        open={selectedUser !== null}
        onClose={handleCloseDialog}
          maxWidth="lg"
        fullWidth
          className="user-progress-reports-modal"
        >
          <DialogTitle className="user-progress-reports-modal-title">
            <Box display="flex" alignItems="center" gap={1}>
              <PersonIcon sx={{ color: '#ff6b35' }} />
              {selectedUser?.username}'s Progress Details
            </Box>
          </DialogTitle>
          <DialogContent className="user-progress-reports-modal-content">
            {selectedUser && (
              <>
                {/* User Info */}
                <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" fontWeight="600">
                        Username: {selectedUser.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Email: {selectedUser.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {(() => {
                        const stats = getUserStats(selectedUser.id);
                        return (
                          <Box display="flex" gap={2}>
                            <Chip
                              label={`${stats.totalWorkouts} Total`}
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              label={`${stats.completedWorkouts} Completed`}
                              sx={{ backgroundColor: '#27ae60', color: 'white' }}
                            />
                            <Chip
                              label={`${stats.completionRate}% Success`}
                              sx={{ backgroundColor: '#ff6b35', color: 'white' }}
                            />
                          </Box>
                        );
                      })()}
                    </Grid>
                  </Grid>
                </Box>

                {/* Workout Progress Table */}
              <Typography variant="h6" gutterBottom>
                  Workout History
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                        <TableCell>Workout Name</TableCell>
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Duration</TableCell>
                        <TableCell align="center">Calories</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {getFilteredUserProgress(selectedUser.id).map((progress) => {
                        const workout = progress.workout || workouts.find(w => w.id === progress.workout?.id);
                        return (
                          <TableRow key={progress.id}>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <FitnessIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                                <Typography variant="body1" fontWeight="500">
                                  {workout?.name || 'Unknown Workout'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              {new Date(progress.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={progress.completed ? 'Completed' : 'Incomplete'}
                                sx={{
                                  backgroundColor: progress.completed ? '#27ae60' : '#f7931e',
                                  color: 'white',
                                  fontWeight: '600'
                                }}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              {workout?.duration ? `${workout.duration} min` : 'N/A'}
                            </TableCell>
                            <TableCell align="center">
                              {workout?.calories ? `${workout.calories} cal` : 'N/A'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                {getFilteredUserProgress(selectedUser.id).length === 0 && (
                  <Box textAlign="center" py={4}>
                    <ScheduleIcon sx={{ fontSize: 48, color: '#ff6b35', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      No Workout History
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      This user hasn't completed any workouts yet.
                    </Typography>
                  </Box>
                )}
            </>
          )}
        </DialogContent>
          <DialogActions className="user-progress-reports-modal-actions">
            <Button onClick={handleCloseDialog} className="user-progress-reports-modal-close-button">
              Close
            </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
  );
};

export default UserProgressReports;
