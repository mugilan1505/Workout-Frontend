import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  Tooltip,
  Input
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  FitnessCenter as FitnessIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchWorkouts, 
  createWorkout, 
  updateWorkout, 
  deleteWorkout,
  clearError 
} from '../redux/slices/workoutSlice';
import api from '../services/api';

const Workouts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { workouts, loading, error } = useSelector((state) => state.workouts);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const [openDialog, setOpenDialog] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterBodyPart, setFilterBodyPart] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: '',
    bodyPart: '',
    duration: '',
    calories: '',
    instructions: '',
    equipment: '',
    videoUrl: '',
    imageUrl: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Body part categories
  const bodyParts = [
    'Chest',
    'Back',
    'Legs',
    'Arms',
    'Shoulders',
    'Core',
    'Full Body',
    'Yoga',
    'Cardio',
    'Flexibility'
  ];

  // Difficulty levels
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
  }, [error, dispatch]);

    const handleOpenDialog = (workout = null) => {
    if (workout) {
      setEditingWorkout(workout);
      setFormData({
        name: workout.name,
        description: workout.description || '',
        difficulty: workout.difficulty || '',
        bodyPart: workout.bodyPart || '',
        duration: workout.duration || '',
        calories: workout.calories || '',
        instructions: workout.instructions || '',
        equipment: workout.equipment || '',
        videoUrl: workout.videoUrl || '',
        imageUrl: workout.imageUrl || ''
      });
      setImagePreview(workout.imageUrl || '');
    } else {
      setEditingWorkout(null);
      setFormData({
        name: '',
        description: '',
        difficulty: '',
        bodyPart: '',
        duration: '',
        calories: '',
        instructions: '',
        equipment: '',
        videoUrl: '',
        imageUrl: ''
      });
      setImagePreview('');
    }
    setSelectedImage(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingWorkout(null);
    setFormData({ 
      name: '', 
      description: '', 
      difficulty: '', 
      bodyPart: '',
      duration: '', 
      calories: '',
      instructions: '',
      equipment: '',
      videoUrl: '',
      imageUrl: ''
    });
    setSelectedImage(null);
    setSelectedVideo(null);
    setImagePreview('');
    setVideoPreview('');
  };



  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      await dispatch(deleteWorkout(id));
    }
  };

  const handleOpenDetails = (workout) => {
    setSelectedWorkout(workout);
    setDetailsOpen(true);
  };
  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedWorkout(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return '#27ae60';
      case 'intermediate': return '#f7931e';
      case 'advanced': return '#e74c3c';
      default: return '#5a6c7d';
    }
  };

  const getBodyPartColor = (bodyPart) => {
    const colors = {
      'chest': '#ff6b35',
      'back': '#3498db',
      'legs': '#9b59b6',
      'arms': '#e74c3c',
      'shoulders': '#f39c12',
      'core': '#1abc9c',
      'full body': '#34495e',
      'yoga': '#8e44ad',
      'cardio': '#e67e22',
      'flexibility': '#16a085'
    };
    return colors[bodyPart?.toLowerCase()] || '#5a6c7d';
  };

  // Filter workouts based on selected filters
  const filteredWorkouts = workouts.filter(workout => {
    const matchesDifficulty = filterDifficulty === 'all' || 
      workout.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
    const matchesBodyPart = filterBodyPart === 'all' || 
      workout.bodyPart?.toLowerCase() === filterBodyPart.toLowerCase();
    return matchesDifficulty && matchesBodyPart;
  });

  // Group workouts by body part for admin view
  const workoutsByBodyPart = bodyParts.reduce((acc, bodyPart) => {
    acc[bodyPart] = filteredWorkouts.filter(workout => 
      workout.bodyPart?.toLowerCase() === bodyPart.toLowerCase()
    );
    return acc;
  }, {});

  const clearFilters = () => {
    setFilterDifficulty('all');
    setFilterBodyPart('all');
    setSelectedTab(0);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedVideo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const uploadVideo = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      let finalImageUrl = formData.imageUrl;
      let finalVideoUrl = formData.videoUrl;
      
      // Upload new image if selected
      if (selectedImage) {
        setUploadingImage(true);
        finalImageUrl = await uploadImage(selectedImage);
        setUploadingImage(false);
      }

      // Upload new video if selected
      if (selectedVideo) {
        setUploadingVideo(true);
        finalVideoUrl = await uploadVideo(selectedVideo);
        setUploadingVideo(false);
      }

      const workoutData = {
        ...formData,
        imageUrl: finalImageUrl,
        videoUrl: finalVideoUrl
      };

      if (editingWorkout) {
        await dispatch(updateWorkout({ id: editingWorkout.id, workoutData }));
      } else {
        await dispatch(createWorkout(workoutData));
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving workout:', error);
      setUploadingImage(false);
      setUploadingVideo(false);
    }
  };

  if (loading) {
    return (
      <Box className="workouts-container">
        <Container maxWidth="lg" className="workouts-content">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress sx={{ color: '#ff6b35' }} />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="workouts-container">
      <Container maxWidth="lg" className="workouts-content">
        {/* Header */}
        <Box className="workouts-header">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h3" className="workouts-title">
              {isAdmin ? 'Workout Management' : 'Workouts'}
            </Typography>
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                className="workouts-add-button"
              >
                Add Workout
              </Button>
            )}
          </Box>
          <Typography variant="body1" className="workouts-subtitle">
            {isAdmin 
              ? 'Manage and organize workout routines with advanced categorization'
              : 'Discover personalized workouts designed to help you achieve your fitness goals'
            }
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="workouts-error-alert">
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="workout-stat-card">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <FitnessIcon sx={{ fontSize: 48, color: '#ff6b35', mb: 2 }} />
                <Typography variant="h4" className="workout-stat-value">
                  {workouts.length}
                </Typography>
                <Typography variant="body2" className="workout-stat-label">
                  Total Workouts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="workout-stat-card">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <TimerIcon sx={{ fontSize: 48, color: '#f7931e', mb: 2 }} />
                <Typography variant="h4" className="workout-stat-value">
                  {workouts.filter(w => w.difficulty?.toLowerCase() === 'beginner').length}
                </Typography>
                <Typography variant="body2" className="workout-stat-label">
                  Beginner Level
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="workout-stat-card">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 48, color: '#27ae60', mb: 2 }} />
                <Typography variant="h4" className="workout-stat-value">
                  {workouts.filter(w => w.difficulty?.toLowerCase() === 'intermediate').length}
                </Typography>
                <Typography variant="body2" className="workout-stat-label">
                  Intermediate Level
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="workout-stat-card">
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <FitnessIcon sx={{ fontSize: 48, color: '#e74c3c', mb: 2 }} />
                <Typography variant="h4" className="workout-stat-value">
                  {workouts.filter(w => w.difficulty?.toLowerCase() === 'advanced').length}
                </Typography>
                <Typography variant="body2" className="workout-stat-label">
                  Advanced Level
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Box sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <FilterIcon sx={{ color: '#ff6b35' }} />
            <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 600 }}>
              Filters
            </Typography>
            <Button
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              sx={{ color: '#5a6c7d', textTransform: 'none' }}
            >
              Clear Filters
            </Button>
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={filterDifficulty}
                label="Difficulty"
                onChange={(e) => setFilterDifficulty(e.target.value)}
                size="small"
              >
                <MenuItem value="all">All Difficulties</MenuItem>
                {difficulties.map(difficulty => (
                  <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Body Part</InputLabel>
              <Select
                value={filterBodyPart}
                label="Body Part"
                onChange={(e) => setFilterBodyPart(e.target.value)}
                size="small"
              >
                <MenuItem value="all">All Body Parts</MenuItem>
                {bodyParts.map(bodyPart => (
                  <MenuItem key={bodyPart} value={bodyPart}>{bodyPart}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Tabs for Admin View */}
        {isAdmin && (
          <Box sx={{ mb: 3 }}>
            <Tabs 
              value={selectedTab} 
              onChange={(e, newValue) => setSelectedTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="All Workouts" />
              <Tab label="By Body Part" />
              <Tab label="By Difficulty" />
            </Tabs>
          </Box>
        )}

        {/* Workouts Display */}
        {selectedTab === 0 && (
        <Grid container spacing={3}>
            {filteredWorkouts.length === 0 ? (
            <Grid item xs={12}>
                <Card className="workout-card">
                <CardContent sx={{ textAlign: 'center', p: 6 }}>
                  <FitnessIcon sx={{ fontSize: 64, color: '#ff6b35', mb: 2 }} />
                    <Typography variant="h5" className="workout-title" gutterBottom>
                    No Workouts Available
                  </Typography>
                    <Typography variant="body1" className="workout-description" sx={{ mb: 3 }}>
                    {isAdmin 
                      ? 'Create your first workout to get started!' 
                        : 'No workouts match your current filters.'}
                  </Typography>
                  {isAdmin && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog()}
                        className="workouts-add-button"
                    >
                      Create First Workout
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ) : (
              filteredWorkouts.map((workout) => (
              <Grid item xs={12} sm={6} md={4} key={workout.id}>
                  <Card className="workout-card">
                  <CardMedia
                    component="img"
                    height="200"
                    image={workout.imageUrl ? (workout.imageUrl.startsWith('http') ? workout.imageUrl : `http://localhost:8080${workout.imageUrl}`) : "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop"}
                    alt={workout.name}
                    sx={{ objectFit: 'cover' }}
                  />
                    <CardContent className="workout-card-content">
                      <Box className="workout-card-header">
                        <Typography gutterBottom variant="h6" component="div" className="workout-title">
                        {workout.name}
                      </Typography>
                      {isAdmin && (
                        <Box>
                            <Tooltip title="Edit Workout">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(workout)}
                                className="workout-edit-button"
                          >
                            <EditIcon />
                          </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Workout">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(workout.id)}
                                className="workout-delete-button"
                          >
                            <DeleteIcon />
                          </IconButton>
                            </Tooltip>
                        </Box>
                      )}
                    </Box>
                    
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {workout.difficulty && (
                      <Chip
                            label={workout.difficulty}
                        sx={{
                          backgroundColor: getDifficultyColor(workout.difficulty),
                          color: 'white',
                              fontSize: '0.75rem'
                            }}
                            size="small"
                          />
                        )}
                        {workout.bodyPart && (
                          <Chip
                            label={workout.bodyPart}
                            sx={{
                              backgroundColor: getBodyPartColor(workout.bodyPart),
                              color: 'white',
                              fontSize: '0.75rem'
                        }}
                        size="small"
                      />
                    )}
                      </Box>
                    
                      <Typography variant="body2" className="workout-description" sx={{ mb: 2 }}>
                      {workout.description || 'No description available.'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      {workout.duration && (
                        <Chip
                          icon={<TimerIcon />}
                          label={`${workout.duration} min`}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: '#ff6b35', color: '#ff6b35' }}
                        />
                      )}
                      {workout.calories && (
                        <Chip
                          label={`${workout.calories} cal`}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: '#f7931e', color: '#f7931e' }}
                        />
                      )}
                    </Box>
                    
                    <Button 
                      variant="contained" 
                      fullWidth 
                      startIcon={<PlayIcon />}
                      className="workout-view-button"
                      onClick={() => isAdmin ? handleOpenDetails(workout) : navigate(`/workout/${workout.id}`)}
                    >
                      {isAdmin ? 'View Details' : 'Start Workout'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
        )}

        {/* Body Part View for Admin */}
        {selectedTab === 1 && isAdmin && (
          <Box>
            {bodyParts.map((bodyPart) => {
              const bodyPartWorkouts = workoutsByBodyPart[bodyPart];
              if (bodyPartWorkouts.length === 0) return null;
              
              return (
                <Box key={bodyPart} sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ 
                    color: getBodyPartColor(bodyPart), 
                    fontWeight: 700, 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <FitnessIcon />
                    {bodyPart} ({bodyPartWorkouts.length})
                  </Typography>
                  <Grid container spacing={3}>
                    {bodyPartWorkouts.map((workout) => (
                      <Grid item xs={12} sm={6} md={4} key={workout.id}>
                        <Card className="workout-card">
                          <CardContent className="workout-card-content">
                            <Box className="workout-card-header">
                              <Typography variant="h6" className="workout-title">
                                {workout.name}
                              </Typography>
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog(workout)}
                                  className="workout-edit-button"
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(workout.id)}
                                  className="workout-delete-button"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>
                            <Chip
                              label={workout.difficulty}
                              sx={{
                                backgroundColor: getDifficultyColor(workout.difficulty),
                                color: 'white',
                                mb: 2
                              }}
                              size="small"
                            />
                            <Typography variant="body2" className="workout-description" sx={{ mb: 2 }}>
                              {workout.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              {workout.duration && (
                                <Chip label={`${workout.duration} min`} size="small" />
                              )}
                              {workout.calories && (
                                <Chip label={`${workout.calories} cal`} size="small" />
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Difficulty View for Admin */}
        {selectedTab === 2 && isAdmin && (
          <Box>
            {difficulties.map((difficulty) => {
              const difficultyWorkouts = filteredWorkouts.filter(
                workout => workout.difficulty?.toLowerCase() === difficulty.toLowerCase()
              );
              if (difficultyWorkouts.length === 0) return null;
              
              return (
                <Box key={difficulty} sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ 
                    color: getDifficultyColor(difficulty), 
                    fontWeight: 700, 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <TrendingUpIcon />
                    {difficulty} Level ({difficultyWorkouts.length})
                  </Typography>
                  <Grid container spacing={3}>
                    {difficultyWorkouts.map((workout) => (
                      <Grid item xs={12} sm={6} md={4} key={workout.id}>
                        <Card className="workout-card">
                          <CardContent className="workout-card-content">
                            <Box className="workout-card-header">
                              <Typography variant="h6" className="workout-title">
                                {workout.name}
                              </Typography>
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog(workout)}
                                  className="workout-edit-button"
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(workout.id)}
                                  className="workout-delete-button"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>
                            {workout.bodyPart && (
                              <Chip
                                label={workout.bodyPart}
                                sx={{
                                  backgroundColor: getBodyPartColor(workout.bodyPart),
                                  color: 'white',
                                  mb: 2
                                }}
                                size="small"
                              />
                            )}
                            <Typography variant="body2" className="workout-description" sx={{ mb: 2 }}>
                              {workout.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              {workout.duration && (
                                <Chip label={`${workout.duration} min`} size="small" />
                              )}
                              {workout.calories && (
                                <Chip label={`${workout.calories} cal`} size="small" />
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              );
            })}
          </Box>
        )}
      </Container>

      {/* Enhanced Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle className="workout-modal-title">
          {editingWorkout ? 'Edit Workout' : 'Add New Workout'}
        </DialogTitle>
        <DialogContent className="workout-modal-content">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
          <TextField
            autoFocus
            margin="dense"
            label="Workout Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="workout-modal-input"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense" className="workout-modal-select">
                <InputLabel>Body Part</InputLabel>
                <Select
                  value={formData.bodyPart}
                  label="Body Part"
                  onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value })}
                >
                  {bodyParts.map(bodyPart => (
                    <MenuItem key={bodyPart} value={bodyPart}>{bodyPart}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense" className="workout-modal-select">
                <InputLabel>Difficulty Level</InputLabel>
            <Select
              value={formData.difficulty}
                  label="Difficulty Level"
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            >
                  {difficulties.map(difficulty => (
                    <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                  ))}
            </Select>
          </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
          <TextField
            margin="dense"
            label="Duration (minutes)"
            fullWidth
            variant="outlined"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="workout-modal-input"
          />
            </Grid>
            <Grid item xs={12} md={6}>
          <TextField
            margin="dense"
            label="Calories Burned"
            fullWidth
            variant="outlined"
            type="number"
            value={formData.calories}
            onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="workout-modal-input"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Equipment Needed"
                fullWidth
                variant="outlined"
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                className="workout-modal-input"
                placeholder="e.g., Dumbbells, Resistance Bands, None"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Video URL"
                fullWidth
                variant="outlined"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="workout-modal-input"
                placeholder="https://example.com/video.mp4"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Image URL"
                fullWidth
                variant="outlined"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="workout-modal-input"
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="workout-modal-input"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Instructions"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="workout-modal-input"
                placeholder="Step-by-step instructions for the workout..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="workout-modal-actions">
          <Button onClick={handleCloseDialog} className="workout-modal-cancel-button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="workout-modal-save-button">
            {editingWorkout ? 'Update Workout' : 'Create Workout'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Workout Details Modal */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle>Workout Details</DialogTitle>
        <DialogContent>
          {selectedWorkout && (
            <Box>
              <video
                width="100%"
                height="240"
                controls
                autoPlay
                loop
                style={{ borderRadius: 12, marginBottom: 16 }}
              >
                <source src={selectedWorkout.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Typography variant="h5" gutterBottom>{selectedWorkout.name}</Typography>
              <Typography variant="subtitle1" gutterBottom>{selectedWorkout.description}</Typography>
              <Typography variant="body2" gutterBottom><b>Body Part:</b> {selectedWorkout.bodyPart}</Typography>
              <Typography variant="body2" gutterBottom><b>Difficulty:</b> {selectedWorkout.difficulty}</Typography>
              <Typography variant="body2" gutterBottom><b>Duration:</b> {selectedWorkout.duration} min</Typography>
              <Typography variant="body2" gutterBottom><b>Calories:</b> {selectedWorkout.calories}</Typography>
              <Typography variant="body2" gutterBottom><b>Equipment:</b> {selectedWorkout.equipment}</Typography>
              <Typography variant="body2" gutterBottom><b>Instructions:</b> {selectedWorkout.instructions}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Workouts;
