import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Container,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  ArrowBack as BackIcon,
  Timer as TimerIcon,
  FitnessCenter as FitnessIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWorkouts } from '../redux/slices/workoutSlice';
import { createProgress } from '../redux/slices/progressSlice';
import '../styles/WorkoutDetails.css';

const WorkoutDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { workouts, loading, error } = useSelector((state) => state.workouts);
  const { user } = useSelector((state) => state.auth);

  const [workout, setWorkout] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  useEffect(() => {
    if (workouts.length > 0) {
      const foundWorkout = workouts.find(w => w.id === parseInt(id));
      if (foundWorkout) {
        setWorkout(foundWorkout);
        setTimer(foundWorkout.duration * 60 || 0); // Convert minutes to seconds
      }
    }
  }, [workouts, id]);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setShowCompleteDialog(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkout = () => {
    setIsPlaying(true);
    setIsTimerRunning(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handlePauseWorkout = () => {
    setIsPlaying(false);
    setIsTimerRunning(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleStopWorkout = () => {
    setIsPlaying(false);
    setIsTimerRunning(false);
    setTimer(workout.duration * 60 || 0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleCompleteWorkout = async () => {
    if (!user) {
      console.error('User not authenticated');
      setShowCompleteDialog(false);
      return;
    }

    try {
      const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const progressData = {
        userId: user.id,
        workoutId: workout.id,
        workoutName: workout.name,
        completed: true,
        completionDate: currentDate,
        durationMinutes: workout.duration,
        caloriesBurned: workout.calories,
        difficulty: workout.difficulty,
        bodyPart: workout.bodyPart,
        notes: `Completed ${workout.name} workout on ${currentDate}. Duration: ${workout.duration} minutes, Calories: ${workout.calories} cal`,
        performanceRating: 5, // Default to 5 stars, can be made configurable
        completedAt: new Date().toISOString()
      };
      
      const resultAction = await dispatch(createProgress(progressData));
      
      if (createProgress.fulfilled.match(resultAction)) {
        setWorkoutCompleted(true);
        setShowCompleteDialog(false);
        
        // Optional: Show success message for 5 seconds
        setTimeout(() => {
          setWorkoutCompleted(false);
        }, 5000);
      } else {
        throw new Error(resultAction.error.message || 'Failed to save workout progress');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('Failed to save workout progress. Please try again.');
      setShowCompleteDialog(false);
    }
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

  if (loading) {
    return (
      <Box className="workout-details-container">
        <Container maxWidth="lg" className="workout-details-content">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress sx={{ color: '#ff6b35' }} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="workout-details-container">
        <Container maxWidth="lg" className="workout-details-content">
          <Alert severity="error" className="workout-details-error-alert">
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!workout) {
    return (
      <Box className="workout-details-container">
        <Container maxWidth="lg" className="workout-details-content">
          <Alert severity="warning" className="workout-details-error-alert">
            Workout not found
          </Alert>
        </Container>
      </Box>
    );
  }

  const progressPercentage = ((workout.duration * 60 - timer) / (workout.duration * 60)) * 100;

  return (
    <Box className="workout-details-container">
      <Container maxWidth="lg" className="workout-details-content">
        {/* Header */}
        <Box className="workout-details-header" sx={{ mb: 3 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/workouts')}
            sx={{ mb: 2 }}
          >
            Back to Workouts
          </Button>
          <Typography variant="h3" className="workout-details-title">
            {workout.name}
          </Typography>
          <Typography variant="body1" className="workout-details-subtitle">
            Get ready to challenge yourself with this {workout.difficulty?.toLowerCase()} level workout
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          {/* Video Section */}
          <Box sx={{ flex: 1 }}>
            <Card className="workout-video-card">
              <CardContent sx={{ p: 0 }}>
                                 {/* Workout Image */}
                 {workout.imageUrl && (
                   <Box sx={{ p: 2, textAlign: 'center' }}>
                     <img 
                       src={workout.imageUrl.startsWith('http') ? workout.imageUrl : `https://workout-backend-oux2.onrender.com${workout.imageUrl}`}
                       alt={workout.name}
                       style={{ 
                         width: '100%', 
                         maxHeight: '200px', 
                         objectFit: 'cover',
                         borderRadius: '8px'
                       }} 
                     />
                   </Box>
                 )}
                                 <video
                   ref={videoRef}
                   width="100%"
                   height="400"
                   controls
                   loop
                   style={{ borderRadius: '12px 12px 0 0' }}
                 >
                   <source src={workout.videoUrl ? (workout.videoUrl.startsWith('http') ? workout.videoUrl : `https://workout-backend-oux2.onrender.com${workout.videoUrl}`) : 'https://www.w3schools.com/html/mov_bbb.mp4'} type="video/mp4" />
                   Your browser does not support the video tag.
                 </video>
                
                {/* Timer Section */}
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <TimerIcon sx={{ mr: 1, color: '#ff6b35' }} />
                    <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {formatTime(timer)}
                    </Typography>
                  </Box>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={progressPercentage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4, 
                      mb: 2,
                      backgroundColor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#ff6b35'
                      }
                    }} 
                  />
                  
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    {!isPlaying ? (
                      <Button
                        variant="contained"
                        startIcon={<PlayIcon />}
                        onClick={handleStartWorkout}
                        sx={{ 
                          backgroundColor: '#ff6b35',
                          '&:hover': { backgroundColor: '#e55a2b' }
                        }}
                      >
                        Start Workout
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          startIcon={<PauseIcon />}
                          onClick={handlePauseWorkout}
                          sx={{ borderColor: '#ff6b35', color: '#ff6b35' }}
                        >
                          Pause
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<StopIcon />}
                          onClick={handleStopWorkout}
                          sx={{ borderColor: '#e74c3c', color: '#e74c3c' }}
                        >
                          Stop
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Details Section */}
          <Box sx={{ flex: 1 }}>
            <Card className="workout-details-info-card">
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  Workout Details
                </Typography>

                {/* Difficulty and Body Part */}
                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                  {workout.difficulty && (
                    <Chip
                      label={workout.difficulty}
                      sx={{
                        backgroundColor: getDifficultyColor(workout.difficulty),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                  {workout.bodyPart && (
                    <Chip
                      label={workout.bodyPart}
                      sx={{
                        backgroundColor: getBodyPartColor(workout.bodyPart),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Box>

                {/* Stats */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TimerIcon sx={{ mr: 1, color: '#ff6b35' }} />
                    <Typography variant="body1">
                      <strong>Duration:</strong> {workout.duration} minutes
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon sx={{ mr: 1, color: '#f7931e' }} />
                    <Typography variant="body1">
                      <strong>Calories:</strong> {workout.calories} cal
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FitnessIcon sx={{ mr: 1, color: '#27ae60' }} />
                    <Typography variant="body1">
                      <strong>Equipment:</strong> {workout.equipment || 'None required'}
                    </Typography>
                  </Box>
                </Box>

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {workout.description || 'No description available.'}
                  </Typography>
                </Box>

                {/* Instructions */}
                {workout.instructions && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Instructions
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {workout.instructions}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Completion Dialog */}
        <Dialog open={showCompleteDialog} onClose={() => setShowCompleteDialog(false)}>
          <DialogTitle>Workout Complete! 🎉</DialogTitle>
          <DialogContent>
            <Typography>
              Congratulations! You've completed the {workout.name} workout.
              Great job staying committed to your fitness goals!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCompleteDialog(false)}>Close</Button>
            <Button 
              onClick={handleCompleteWorkout}
              variant="contained"
              startIcon={<CheckIcon />}
              sx={{ backgroundColor: '#27ae60' }}
            >
              Mark Complete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Message */}
        {workoutCompleted && (
          <Alert 
            severity="success" 
            sx={{ mt: 2 }}
            onClose={() => setWorkoutCompleted(false)}
          >
            Workout marked as complete! Keep up the great work!
          </Alert>
        )}
      </Container>
    </Box>
  );
};

export default WorkoutDetails; 