import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  CardContent,
  Container,
  Grid,
  Avatar,
  Divider,
  IconButton,
  Chip
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  FitnessCenter as FitnessIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    fullName: user?.fullName || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    fitnessGoal: user?.fitnessGoal || ''
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleUpdateProfile = () => {
    // TODO: Implement profile update logic
    console.log('Profile update attempt', formData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      fullName: user?.fullName || '',
      age: user?.age || '',
      weight: user?.weight || '',
      height: user?.height || '',
      fitnessGoal: user?.fitnessGoal || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Box className="modern-home-container">
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Card className="modern-card">
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h5" className="modern-title" gutterBottom>
                Please Login
              </Typography>
              <Typography variant="body1" className="modern-text">
                You need to be logged in to view your profile.
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="modern-home-container">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" className="modern-title" sx={{ mb: 1 }}>
            Your Profile
          </Typography>
          <Typography variant="body1" className="modern-text">
            Manage your personal information and fitness preferences
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Profile Overview */}
          <Grid item xs={12} md={4}>
            <Card className="modern-card hover-lift">
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Avatar 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: 'auto', 
                    mb: 3,
                    bgcolor: '#ff6b35',
                    fontSize: '3rem'
                  }}
                >
                  {user.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h5" className="modern-title" gutterBottom>
                  {user.username}
                </Typography>
                <Typography variant="body2" className="modern-text" sx={{ mb: 2 }}>
                  {user.email}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                  <Chip 
                    label="Active User" 
                    sx={{ 
                      backgroundColor: '#27ae60', 
                      color: 'white' 
                    }} 
                    size="small" 
                  />
                  {user.roles?.includes('ROLE_ADMIN') && (
                    <Chip 
                      label="Admin" 
                      sx={{ 
                        backgroundColor: '#ff6b35', 
                        color: 'white' 
                      }} 
                      size="small" 
                    />
                  )}
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    borderColor: '#e74c3c',
                    color: '#e74c3c',
                    '&:hover': {
                      borderColor: '#c0392b',
                      backgroundColor: 'rgba(231, 76, 60, 0.1)'
                    }
                  }}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            <Card className="modern-card">
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h5" className="modern-title">
                    Personal Information
                  </Typography>
                  <IconButton
                    onClick={() => setIsEditing(!isEditing)}
                    sx={{ color: '#ff6b35' }}
                  >
                    {isEditing ? <CancelIcon /> : <EditIcon />}
                  </IconButton>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      value={formData.username}
                      disabled
                      className="modern-input"
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: '#ff6b35' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={formData.email}
                      disabled
                      className="modern-input"
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: '#ff6b35' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      disabled={!isEditing}
                      className="modern-input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      disabled={!isEditing}
                      className="modern-input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Weight (kg)"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      disabled={!isEditing}
                      className="modern-input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Height (cm)"
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      disabled={!isEditing}
                      className="modern-input"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Fitness Goal"
                      value={formData.fitnessGoal}
                      onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                      disabled={!isEditing}
                      multiline
                      rows={3}
                      className="modern-input"
                      placeholder="Describe your fitness goals..."
                    />
                  </Grid>
                </Grid>

                {isEditing && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleUpdateProfile}
                      className="modern-button"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      sx={{
                        borderColor: '#5a6c7d',
                        color: '#5a6c7d',
                        '&:hover': {
                          borderColor: '#2c3e50',
                          backgroundColor: 'rgba(90, 108, 125, 0.1)'
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Fitness Stats */}
            <Card className="modern-card" sx={{ mt: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" className="modern-title" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <FitnessIcon sx={{ mr: 1, color: '#ff6b35' }} />
                  Fitness Statistics
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" className="modern-title">
                        0
                      </Typography>
                      <Typography variant="body2" className="modern-text">
                        Workouts Completed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" className="modern-title">
                        0
                      </Typography>
                      <Typography variant="body2" className="modern-text">
                        Days Active
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" className="modern-title">
                        0%
                      </Typography>
                      <Typography variant="body2" className="modern-text">
                        Goal Progress
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" className="modern-title" gutterBottom>
                  Recent Activity
                </Typography>
                <Typography variant="body2" className="modern-text" sx={{ fontStyle: 'italic' }}>
                  No recent activity. Start your first workout to see your progress here!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;
