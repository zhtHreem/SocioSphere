import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {AppBar,Toolbar,Typography,Button,Box,IconButton,Drawer,List, ListItem, ListItemIcon,ListItemText, Container,Paper, Menu,MenuItem,} from '@mui/material';
import {
  Home as HomeIcon,
  NotificationsActive as NotificationsIcon,
  Info as AboutIcon,
  People as SocietiesIcon,
  ContactMail as ContactIcon,
  Person as ProfileIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Notifications from '../Home/notifications';
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For notification dropdown
   
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const token = localStorage.getItem('token'); // Adjust based on your storage mechanism
  let role = null;

  try {
    if (typeof token === 'string' && token.trim() !== '') {
      role = jwtDecode(token)?.role; // Decode token and get role
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }

  const path = role === 'admin' ? '/admin' : '/user'; // Default path if no role

  // Check if there's a token in localStorage when the component mounts
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/auth');
  };

  

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
   
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { name: 'Home', icon: <HomeIcon />, link: '/' },
    { name: 'About', icon: <AboutIcon />, link: '/about' },
    { name: 'Contact', icon: <ContactIcon />, link: '/contact' },
    { name: 'Societies', icon: <SocietiesIcon />, link: '/society' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: 250 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Menu
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} onClick={() => navigate(item.link)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
        {isLoggedIn ? (
          <>
            <ListItem button onClick={() => navigate(path)}>
              <ListItemIcon>
                <ProfileIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <ListItem onClick={() => navigate('/auth')}>
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', overflow: 'hidden' }}>
      <AppBar sx={{   background: 'white',   boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden',  position: 'relative',  }}  >
        <Toolbar>
          <IconButton  color="inherit"  aria-label="open drawer"  edge="start" onClick={handleDrawerToggle} sx={{color:"black", mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6"  component="div" sx={{ color: 'black', flexGrow: 1, fontWeight: 'bold' }} >
            SocioSphere
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item, index) => (
              <Button key={index} startIcon={item.icon} onClick={() => navigate(item.link)} sx={{  mx: 1, color: 'black',   '&:hover': { background: 'rgba(255,255,255,0.2)' },  }}  >
                {item.name}
              </Button>
            ))}

            {/* Notification Bell */}
            {(isLoggedIn &&(
            <IconButton  sx={{ color: 'black' }} onClick={handleNotificationClick} >
              <NotificationsIcon />
            </IconButton>
            ))}

            {/* Notifications Dropdown */}
            <Notifications anchorEl={anchorEl} onClose={handleNotificationClose} />


            {isLoggedIn ? (
              <>
                <IconButton    sx={{ color: 'black' }} onClick={() => navigate(path)} >
                  <ProfileIcon />
                </IconButton>
                <Button sx={{ color: 'black' }} startIcon={<LogoutIcon />} onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button sx={{ color: 'black' }} startIcon={<LoginIcon />} onClick={() => navigate('/auth')} >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{  keepMounted: true,  }} sx={{color:"black" ,display: { xs: 'block', sm: 'none' },  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 }, }}>
        {drawer}
      </Drawer>
    </Box>
  );
};

const Footer = () => {
  return (
    <Paper
      component="footer"
      square
      variant="outlined"
      sx={{  background: 'white',  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',mt:10,  py: 3, px: 2,bottom: 0, overflow: 'hidden', zIndex: 0,        }}>
      <Container maxWidth="lg">
        <Box sx={{  display: 'flex', justifyContent: 'space-between',   alignItems: 'center', }} >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} My App. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button size="small" color="primary">
              Privacy Policy
            </Button>
            <Button size="small" color="primary">
              Terms of Service
            </Button>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export { Navbar, Footer };
