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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAdd as RegisterIcon,
  FitnessCenter as FitnessIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../redux/slices/authSlice';
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // default role is Normal User
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await dispatch(register(formData)).unwrap();
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="register-container">
      <Container maxWidth="lg" className="register-content">
        <Grid container spacing={4} alignItems="center" minHeight="80vh">
          {/* Left Side - Content */}
          <Grid item xs={12} md={6}>
            <Box className="register-left-section">
              <Typography variant="h2" className="register-title">
                Join Our Community
              </Typography>
              <Typography variant="h4" className="register-subtitle">
                Start your fitness journey today
              </Typography>
              <Typography variant="body1" className="register-description">
                Create your account and unlock access to personalized workouts, nutrition plans, and progress tracking to help you achieve your fitness goals.
              </Typography>

              {/* Benefits */}
              <Box className="register-benefits">
                <Box className="register-benefit-item">
                  <CheckCircleIcon className="register-benefit-icon" />
                  <Typography variant="body1" className="register-benefit-text">
                    Personalized workout routines tailored to your fitness level
                  </Typography>
                </Box>
                <Box className="register-benefit-item">
                  <CheckCircleIcon className="register-benefit-icon" />
                  <Typography variant="body1" className="register-benefit-text">
                    Expert nutrition guidance and meal planning
                  </Typography>
                </Box>
                <Box className="register-benefit-item">
                  <CheckCircleIcon className="register-benefit-icon" />
                  <Typography variant="body1" className="register-benefit-text">
                    Progress tracking with detailed analytics
                  </Typography>
                </Box>
                <Box className="register-benefit-item">
                  <CheckCircleIcon className="register-benefit-icon" />
                  <Typography variant="body1" className="register-benefit-text">
                    24/7 access to your fitness dashboard
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Registration Form */}
          <Grid item xs={12} md={6}>
            <Card className="register-card">
              <CardContent className="register-card-content">
                <Box className="register-card-header">
                  <FitnessIcon className="register-card-icon" />
                  <Typography variant="h4" className="register-card-title" gutterBottom>
                    Create Account
                  </Typography>
                  <Typography variant="body1" className="register-card-subtitle">
                    Fill in your details to get started
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" className="register-error-alert">
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="register-input"
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
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="register-input"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#ff6b35' }} />
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
                    className="register-input"
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
                            className="register-password-toggle"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="register-input"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#ff6b35' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            className="register-password-toggle"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                 

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className="register-button"
                    startIcon={<RegisterIcon />}
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>

                <Divider className="register-divider">
                  <Typography variant="body2" className="register-divider-text">
                    OR
                  </Typography>
                </Divider>

                <Box className="register-footer">
                  <Typography variant="body1" className="register-footer-text">
                    Already have an account?
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    className="register-login-button"
                  >
                    Sign In
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

export default Register;
