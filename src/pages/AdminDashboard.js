import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  People as PeopleIcon,
  FitnessCenter as WorkoutIcon,
  Restaurant as DietIcon,
  TrendingUp as ProgressIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchUsers, 
  updateUser, 
  deleteUser,
  clearError as clearUserError 
} from '../redux/slices/userSlice';
import { 
  fetchWorkouts, 
  createWorkout, 
  updateWorkout, 
  deleteWorkout,
  clearError as clearWorkoutError 
} from '../redux/slices/workoutSlice';
import { 
  fetchDiets, 
  createDiet, 
  updateDiet, 
  deleteDiet,
  clearError as clearDietError 
} from '../redux/slices/dietSlice';
import { 
  fetchAllProgressDetailed,
  clearError as clearProgressError 
} from '../redux/slices/progressSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, loading: usersLoading, error: usersError } = useSelector((state) => state.users);
  const { workouts, loading: workoutsLoading, error: workoutsError } = useSelector((state) => state.workouts);
  const { diets, loading: dietsLoading, error: dietsError } = useSelector((state) => state.diets);
  const { detailedProgress, loading: progressLoading, error: progressError } = useSelector((state) => state.progress);

  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchWorkouts());
    dispatch(fetchDiets());
    dispatch(fetchAllProgressDetailed());
  }, [dispatch]);

  useEffect(() => {
    const errors = [usersError, workoutsError, dietsError, progressError];
    errors.forEach(error => {
      if (error) {
        setTimeout(() => {
          dispatch(clearUserError());
          dispatch(clearWorkoutError());
          dispatch(clearDietError());
          dispatch(clearProgressError());
        }, 5000);
      }
    });
  }, [usersError, workoutsError, dietsError, progressError, dispatch]);

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setEditingItem(item);
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({});
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async () => {
    console.log('Submitting form data:', formData);
    console.log('Dialog type:', dialogType);
    console.log('Editing item:', editingItem);
    
    switch (dialogType) {
      case 'user':
        if (editingItem) {
          await dispatch(updateUser({ id: editingItem.id, userData: formData }));
        }
        break;
      case 'workout':
        if (editingItem) {
          await dispatch(updateWorkout({ id: editingItem.id, workoutData: formData }));
        } else {
          console.log('Creating workout with data:', formData);
          await dispatch(createWorkout(formData));
        }
        break;
      case 'diet':
        if (editingItem) {
          await dispatch(updateDiet({ id: editingItem.id, dietData: formData }));
        } else {
          console.log('Creating diet with data:', formData);
          await dispatch(createDiet(formData));
        }
        break;
      default:
        break;
    }
    handleCloseDialog();
  };

  const handleDelete = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      switch (type) {
        case 'user':
          await dispatch(deleteUser(id));
          break;
        case 'workout':
          await dispatch(deleteWorkout(id));
          break;
        case 'diet':
          await dispatch(deleteDiet(id));
          break;
        default:
          break;
      }
    }
  };

  // Prepare chart data
  const userStats = {
    total: users.length,
    active: users.filter(u => u.roles?.includes('ROLE_USER')).length,
    admin: users.filter(u => u.roles?.includes('ROLE_ADMIN')).length
  };

  const progressStats = detailedProgress.reduce((stats, progress) => {
    const date = new Date(progress.date).toLocaleDateString();
    if (!stats[date]) {
      stats[date] = { completed: 0, total: 0 };
    }
    stats[date].total++;
    if (progress.completed) {
      stats[date].completed++;
    }
    return stats;
  }, {});

  const progressChartData = Object.entries(progressStats).map(([date, data]) => ({
    date,
    completed: data.completed,
    total: data.total
  }));

  const pieData = [
    { name: 'Users', value: userStats.active, color: '#ff6b35' },
    { name: 'Admins', value: userStats.admin, color: '#f7931e' }
  ];

  // Workout completion statistics
  const workoutStats = workouts.map(workout => {
    const workoutProgress = detailedProgress.filter(p => p.workout?.id === workout.id);
    const completedCount = workoutProgress.filter(p => p.completed).length;
    const totalCount = workoutProgress.length;
    return {
      ...workout,
      completedCount,
      totalCount,
      completionRate: totalCount > 0 ? (completedCount / totalCount * 100).toFixed(1) : 0
    };
  });

  const loading = usersLoading || workoutsLoading || dietsLoading || progressLoading;
  const error = usersError || workoutsError || dietsError || progressError;

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
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" className="modern-title" sx={{ mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" className="modern-text">
            Manage your fitness platform and monitor user progress
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="modern-card hover-lift">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <PeopleIcon sx={{ fontSize: 48, color: '#ff6b35', mb: 2 }} />
                <Typography variant="h4" className="modern-title">
                  {userStats.total}
                </Typography>
                <Typography variant="body2" className="modern-text">
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="modern-card hover-lift">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <WorkoutIcon sx={{ fontSize: 48, color: '#f7931e', mb: 2 }} />
                <Typography variant="h4" className="modern-title">
                  {workouts.length}
                </Typography>
                <Typography variant="body2" className="modern-text">
                  Total Workouts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="modern-card hover-lift">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <DietIcon sx={{ fontSize: 48, color: '#e74c3c', mb: 2 }} />
                <Typography variant="h4" className="modern-title">
                  {diets.length}
                </Typography>
                <Typography variant="body2" className="modern-text">
                  Diet Plans
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="modern-card hover-lift">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <ProgressIcon sx={{ fontSize: 48, color: '#27ae60', mb: 2 }} />
                <Typography variant="h4" className="modern-title">
                  {detailedProgress.length}
                </Typography>
                <Typography variant="body2" className="modern-text">
                  Progress Records
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card className="modern-card">
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" className="modern-title" sx={{ mb: 2 }}>
                  User Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#ff6b35"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="modern-card">
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" className="modern-title" sx={{ mb: 2 }}>
                  Progress Overview
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progressChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#27ae60" name="Completed" />
                    <Bar dataKey="total" fill="#ff6b35" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Card className="modern-card">
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  color: '#5a6c7d',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem'
                },
                '& .Mui-selected': {
                  color: '#ff6b35'
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#ff6b35'
                }
              }}
            >
              <Tab label="Users" />
              <Tab label="Workouts" />
              <Tab label="Diet Plans" />
              <Tab label="Progress Reports" />
            </Tabs>
          </Box>

          {/* Users Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" className="modern-title">Users Management</Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Roles</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.roles?.map((role) => (
                            <Chip 
                              key={role} 
                              label={role} 
                              size="small" 
                              sx={{ 
                                mr: 0.5,
                                backgroundColor: role === 'ROLE_ADMIN' ? '#ff6b35' : '#27ae60',
                                color: 'white'
                              }} 
                            />
                          ))}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog('user', user)}
                            sx={{ color: '#ff6b35' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete('user', user.id)}
                            sx={{ color: '#e74c3c' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Workouts Tab - Enhanced */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" className="modern-title">Workouts Management</Typography>
                <Button
                  variant="contained"
                  onClick={() => handleOpenDialog('workout')}
                  className="modern-button"
                >
                  Add Workout
                </Button>
              </Box>
              
              {/* Workout Statistics */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {workoutStats.map((workout) => (
                  <Grid item xs={12} md={6} lg={4} key={workout.id}>
                    <Card className="modern-card hover-lift">
                      <CardContent>
                        <Typography variant="h6" className="modern-title" gutterBottom>
                          {workout.name}
                        </Typography>
                        <Typography className="modern-text" variant="body2">
                          {workout.description}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Chip 
                            label={workout.difficulty} 
                            color={workout.difficulty === 'Advanced' ? 'error' : workout.difficulty === 'Intermediate' ? 'warning' : 'success'}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip 
                            label={`${workout.completionRate}% Complete`}
                            sx={{
                              backgroundColor: workout.completionRate > 50 ? '#27ae60' : workout.completionRate > 25 ? '#f7931e' : '#e74c3c',
                              color: 'white'
                            }}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" className="modern-text" sx={{ mt: 1 }}>
                          {workout.completedCount} of {workout.totalCount} users completed
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Detailed Workout Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Difficulty</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Completion Rate</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workoutStats.map((workout) => (
                      <TableRow key={workout.id} hover>
                        <TableCell>{workout.name}</TableCell>
                        <TableCell>{workout.description}</TableCell>
                        <TableCell>
                          <Chip 
                            label={workout.difficulty} 
                            color={workout.difficulty === 'Advanced' ? 'error' : workout.difficulty === 'Intermediate' ? 'warning' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              {workout.completionRate}%
                            </Typography>
                            <Box sx={{ width: 100, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                              <Box 
                                sx={{ 
                                  width: `${workout.completionRate}%`, 
                                  height: 8, 
                                  bgcolor: workout.completionRate > 50 ? '#27ae60' : workout.completionRate > 25 ? '#f7931e' : '#e74c3c'
                                }} 
                              />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog('workout', workout)}
                            sx={{ color: '#ff6b35' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete('workout', workout.id)}
                            sx={{ color: '#e74c3c' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Diet Plans Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" className="modern-title">Diet Plans</Typography>
                <Button
                  variant="contained"
                  onClick={() => handleOpenDialog('diet')}
                  className="modern-button"
                >
                  Add Diet Plan
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Calories</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {diets.map((diet) => (
                      <TableRow key={diet.id} hover>
                        <TableCell>{diet.name}</TableCell>
                        <TableCell>{diet.description}</TableCell>
                        <TableCell>{diet.calories}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog('diet', diet)}
                            sx={{ color: '#ff6b35' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete('diet', diet.id)}
                            sx={{ color: '#e74c3c' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Progress Reports Tab - Enhanced */}
          {activeTab === 3 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" className="modern-title" gutterBottom>
                Detailed Progress Reports
              </Typography>
              
              {/* Progress Summary */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Card className="modern-card hover-lift">
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="h4" className="modern-title">
                        {detailedProgress.length}
                      </Typography>
                      <Typography variant="body2" className="modern-text">
                        Total Progress Records
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card className="modern-card hover-lift">
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="h4" className="modern-title">
                        {detailedProgress.filter(p => p.completed).length}
                      </Typography>
                      <Typography variant="body2" className="modern-text">
                        Completed Workouts
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card className="modern-card hover-lift">
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="h4" className="modern-title">
                        {detailedProgress.length > 0 
                          ? ((detailedProgress.filter(p => p.completed).length / detailedProgress.length) * 100).toFixed(1)
                          : 0}%
                      </Typography>
                      <Typography variant="body2" className="modern-text">
                        Completion Rate
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Detailed Progress Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Workout</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detailedProgress.map((progress) => (
                      <TableRow key={progress.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {progress.user?.username || 'Unknown User'}
                            </Typography>
                            <Typography variant="caption" className="modern-text">
                              {progress.user?.email || 'No email'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {progress.workout?.name || 'Unknown Workout'}
                            </Typography>
                            <Typography variant="caption" className="modern-text">
                              {progress.workout?.difficulty || 'No difficulty'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {new Date(progress.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={progress.completed ? <CheckCircleIcon /> : <CancelIcon />}
                            label={progress.completed ? 'Completed' : 'Incomplete'}
                            sx={{
                              backgroundColor: progress.completed ? '#27ae60' : '#e74c3c',
                              color: 'white'
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton size="small" sx={{ color: '#ff6b35' }}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Progress by User */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" className="modern-title" gutterBottom>
                  Progress by User
                </Typography>
                {users.map((user) => {
                  const userProgress = detailedProgress.filter(p => p.user?.id === user.id);
                  const completedCount = userProgress.filter(p => p.completed).length;
                  const totalCount = userProgress.length;
                  
                  if (totalCount === 0) return null;
                  
                  return (
                    <Accordion key={user.id} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                          <Typography variant="subtitle1" fontWeight="bold">
                            {user.username}
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <Chip 
                              label={`${completedCount}/${totalCount} completed`}
                              sx={{
                                backgroundColor: completedCount === totalCount ? '#27ae60' : '#f7931e',
                                color: 'white'
                              }}
                              size="small"
                              //sx={{ mr: 2 }}
                            />
                            <Typography variant="body2" className="modern-text">
                              {totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : 0}%
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600 }}>Workout</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {userProgress.map((progress) => (
                              <TableRow key={progress.id}>
                                <TableCell>{progress.workout?.name}</TableCell>
                                <TableCell>{new Date(progress.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={progress.completed ? 'Completed' : 'Incomplete'}
                                    sx={{
                                      backgroundColor: progress.completed ? '#27ae60' : '#e74c3c',
                                      color: 'white'
                                    }}
                                    size="small"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            </Box>
          )}
        </Card>
      </Container>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle className="modern-title">
          {editingItem ? `Edit ${dialogType}` : `Add New ${dialogType}`}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'user' && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Username"
                fullWidth
                variant="outlined"
                value={formData.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="modern-input"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                variant="outlined"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="modern-input"
                sx={{ mb: 2 }}
              />
            </>
          )}
          {dialogType === 'workout' && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Workout Name"
                fullWidth
                variant="outlined"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="modern-input"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="modern-input"
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={formData.difficulty || ''}
                  label="Difficulty"
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          {dialogType === 'diet' && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Diet Plan Name"
                fullWidth
                variant="outlined"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="modern-input"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="modern-input"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Calories"
                fullWidth
                variant="outlined"
                type="number"
                value={formData.calories || ''}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="modern-input"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#5a6c7d' }}>Cancel</Button>
          <Button onClick={handleSubmit} className="modern-button">
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
