import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  Alert, 
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Divider
} from '@mui/material';
import { 
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  FitnessCenter as FitnessIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await dispatch(login(formData)).unwrap();
      
      // Check if user is admin and redirect accordingly
      if (result.user && result.user.roles && result.user.roles.includes('ROLE_ADMIN')) {
        navigate('/admin/dashboard'); // Redirect admin to admin dashboard
      } else {
        navigate('/'); // Redirect regular users to home
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-container">
      <Container maxWidth="lg" className="login-content">
        <Grid container spacing={4} alignItems="center" minHeight="80vh">
          {/* Left Side - Content */}
          <Grid item xs={12} md={6}>
            <Box className="login-left-section">
              <Typography variant="h2" className="login-title">
                Welcome Back
              </Typography>
              <Typography variant="h4" className="login-subtitle">
                Sign in to your account
              </Typography>
              <Typography variant="body1" className="login-description">
                Access your personalized workout plans, track your progress, and achieve your fitness goals with our comprehensive home workout platform.
              </Typography>
              
              {/* Features */}
              <Box className="login-features">
                <Box className="login-feature-item">
                  <FitnessIcon className="login-feature-icon" sx={{ color: '#ff6b35' }} />
                  <Typography variant="body1" className="login-feature-text">
                    Personalized workout routines
                  </Typography>
                </Box>
                <Box className="login-feature-item">
                  <FitnessIcon className="login-feature-icon" sx={{ color: '#f7931e' }} />
                  <Typography variant="body1" className="login-feature-text">
                    Progress tracking and analytics
                  </Typography>
                </Box>
                <Box className="login-feature-item">
                  <FitnessIcon className="login-feature-icon" sx={{ color: '#27ae60' }} />
                  <Typography variant="body1" className="login-feature-text">
                    Expert nutrition guidance
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Card className="login-card">
              <CardContent className="login-card-content">
                <Box className="login-card-header">
                  <FitnessIcon className="login-card-icon" />
                  <Typography variant="h4" className="login-card-title" gutterBottom>
                    Login
                  </Typography>
                  <Typography variant="body1" className="login-card-subtitle">
                    Enter your credentials to access your account
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" className="login-error-alert">
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="login-input"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#ff6b35' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="login-input"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#ff6b35' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            className="login-password-toggle"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className="login-button"
                    startIcon={<LoginIcon />}
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <Divider className="login-divider">
                  <Typography variant="body2" className="login-divider-text">
                    OR
                  </Typography>
                </Divider>

                <Box className="login-footer">
                  <Typography variant="body1" className="login-footer-text">
                    Don't have an account?
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/register')}
                    className="login-register-button"
                  >
                    Create Account
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
