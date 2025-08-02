import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ user, handleLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = user ? (
    isAdmin ? [
      { text: 'Admin Dashboard', path: '/admin/dashboard' },
      { text: 'Manage Workouts', path: '/workouts' },
      { text: 'Manage Diets', path: '/diets' },
      { text: 'View Progress', path: '/progress' },
      { text: 'Profile', path: '/profile' },
      { text: 'Logout', action: handleLogout }
    ] : [
      { text: 'Workouts', path: '/workouts' },
      { text: 'Diet Plans', path: '/diets' },
      { text: 'Progress', path: '/progress' },
      { text: 'Profile', path: '/profile' },
      { text: 'Logout', action: handleLogout }
    ]
  ) : [
    { text: 'Login', path: '/login' },
    { text: 'Register', path: '/register' }
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Box className="navbar-drawer-header">
        <Typography variant="h6" className="navbar-drawer-brand">
          Home Workout Guide
        </Typography>
        <IconButton onClick={handleDrawerToggle} className="navbar-drawer-close-button">
          <CloseIcon />
        </IconButton>
      </Box>
      <List className="navbar-drawer-list">
        {navItems.map((item) => (
          <ListItem key={item.text} className="navbar-drawer-list-item">
            {item.action ? (
              <Button
                onClick={item.action}
                className="navbar-drawer-button"
              >
                {item.text}
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to={item.path}
                className="navbar-drawer-button"
              >
                {item.text}
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        className="navbar-appbar"
      >
        <Toolbar className="navbar-toolbar">
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            className="navbar-brand"
          >
            Home Workout Guide
          </Typography>
          
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="navbar-mobile-menu-button"
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box className="navbar-desktop-menu">
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  component={item.action ? undefined : RouterLink}
                  to={item.action ? undefined : item.path}
                  onClick={item.action}
                  className="navbar-menu-button"
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        className="navbar-drawer"
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            backgroundColor: 'white'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
