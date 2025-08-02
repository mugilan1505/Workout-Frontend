import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper,
  TextField,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Search as SearchIcon,
  Menu as MenuIcon,
  FitnessCenter as FitnessIcon,
  Restaurant as NutritionIcon,
  TrendingUp as ProgressIcon,
  Facebook,
  Instagram,
  Twitter
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', { email, name });
  };

  return (
    <Box className="modern-home-container">
      

      {/* Main Content */}
      <Container maxWidth="lg" className="main-content">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Content */}
          <Grid item xs={12} md={6}>
            <Box className="content-section">
              <Typography variant="h1" className="hero-title">
                Shape Your Body
              </Typography>
              <Typography variant="h2" className="hero-subtitle">
                With Our Trainer
              </Typography>
              
              <Typography variant="body1" className="hero-description">
                Transform your fitness journey with personalized workouts, expert nutrition guidance, and comprehensive progress tracking. Our professional trainers are here to help you achieve your goals from the comfort of your home.
              </Typography>

              {/* Login Form */}
              <Box className="login-form-section">
                <Typography variant="h4" className="form-title">
                  Login For Join
                </Typography>
                <form onSubmit={handleSubmit} className="login-form">
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    className="submit-button"
                  >
                    Submit
                  </Button>
                </form>
              </Box>

              {/* Social Media */}
              <Box className="social-section">
                <Box className="social-icons">
                  <IconButton className="social-icon">
                    <Facebook />
                  </IconButton>
                  <IconButton className="social-icon">
                    <Instagram />
                  </IconButton>
                  <IconButton className="social-icon">
                    <Twitter />
                  </IconButton>
                </Box>
                <Typography variant="body2" className="social-text">
                  @youraccount
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Illustrations */}
          <Grid item xs={12} md={6}>
            <Box className="illustration-section">
              <Box className="fitness-illustrations">
                {/* Barbell */}
                <Box className="barbell">
                  <Box className="barbell-bar"></Box>
                  <Box className="weight left-weight">
                    <Typography variant="caption">10 kg</Typography>
                  </Box>
                  <Box className="weight right-weight">
                    <Typography variant="caption">10 kg</Typography>
                  </Box>
                </Box>

                {/* Clipboard */}
                <Box className="clipboard">
                  <Box className="clipboard-header"></Box>
                  <Box className="checklist">
                    <Box className="check-item">
                      <Box className="check-box checked"></Box>
                      <Box className="check-line"></Box>
                    </Box>
                    <Box className="check-item">
                      <Box className="check-box checked"></Box>
                      <Box className="check-line"></Box>
                    </Box>
                    <Box className="check-item">
                      <Box className="check-box checked"></Box>
                      <Box className="check-line"></Box>
                    </Box>
                  </Box>
                </Box>

                {/* Exercise Ball */}
                <Box className="exercise-ball"></Box>

                {/* Water Bottle */}
                <Box className="water-bottle">
                  <Box className="bottle-cap"></Box>
                  <Box className="bottle-body"></Box>
                </Box>

                {/* Shoes */}
                <Box className="athletic-shoes">
                  <Box className="shoe left-shoe"></Box>
                  <Box className="shoe right-shoe"></Box>
                </Box>
              </Box>

              {/* Background Elements */}
              <Box className="background-pattern"></Box>
              <Box className="organic-shapes">
                <Box className="shape shape-1"></Box>
                <Box className="shape shape-2"></Box>
                <Box className="shape shape-3"></Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" className="features-section">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card className="feature-card">
              <CardContent>
                <FitnessIcon className="feature-icon" />
                <Typography variant="h5" className="feature-title">
                  Personalized Workouts
                </Typography>
                <Typography variant="body2" className="feature-description">
                  Custom routines designed for your fitness level and goals
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="feature-card">
              <CardContent>
                <NutritionIcon className="feature-icon" />
                <Typography variant="h5" className="feature-title">
                  Expert Nutrition
                </Typography>
                <Typography variant="body2" className="feature-description">
                  Balanced meal plans and healthy recipes tailored for you
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="feature-card">
              <CardContent>
                <ProgressIcon className="feature-icon" />
                <Typography variant="h5" className="feature-title">
                  Track Progress
                </Typography>
                <Typography variant="body2" className="feature-description">
                  Visualize achievements and stay motivated every day
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
