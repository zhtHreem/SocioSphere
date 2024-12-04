import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Container, Paper } from '@mui/material';
import {  Home as HomeIcon,  NotificationsActive as NotificationsIcon, Info as AboutIcon,  People as SocietiesIcon,ContactMail as ContactIcon,  Person as ProfileIcon,  Login as LoginIcon, Logout as LogoutIcon, Menu as MenuIcon} from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate=useNavigate();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const token = localStorage.getItem('token'); // Adjust based on your storage mechanism
    let role = null;
  try {
    if (typeof token === "string" && token.trim() !== "") {
      role = jwtDecode(token)?.role; // Decode token and get role
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  const path = role === "admin" ? "/admin" : "/user"; // Default path if no role

  // Check if there's a token in localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token'); // Check for the token in localStorage
    if (token) {
      setIsLoggedIn(true); // If token exists, user is logged in
    } else {
      setIsLoggedIn(false); // If no token, user is not logged in
    }
  }, []);

   const handleLogout = () => {
    // Remove the token from localStorage or sessionStorage
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsLoggedIn(false); // Update isLoggedIn state
    navigate('/auth'); // Optionally navigate to home or login page
  };

  const handleNavigation = (link) => {
    navigate(link); // Navigate to the specified link
  };
  
  const navItems = [
    { name: 'Home', icon: <HomeIcon />, link: '/' },
    { name: 'About', icon: <AboutIcon />, link: '/about' },
    { name: 'Contact', icon: <ContactIcon />, link: '/contact' },
    { name: 'societies', icon: <SocietiesIcon />, link: '/society' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: 250 ,}}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Menu
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} onClick={() => {  navigate(item.link) }}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
        {isLoggedIn ? (
          <>
            <ListItem button onClick={() => { navigate(path) }}>
              <ListItemIcon><ProfileIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <ListItem onClick={() => {navigate("/auth");setIsLoggedIn(true)}}>
            <ListItemIcon><LoginIcon /></ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex',  overflow:"hidden"}}>
      <AppBar     sx={{   background: 'white',    boxShadow: '0 4px 6px rgba(0,0,0,0.1)' ,overflow:"hidden",position: 'relative'}} >
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }} >

            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6"    component="div"  sx={{color:"black", flexGrow: 1, fontWeight: 'bold' }}>
            SocioSphere
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item, index) => (
           <Button key={index} startIcon={item.icon} onClick={() => navigate(item.link)} // Handle navigation
                sx={{ mx: 1, color: 'black',
                '&:hover': { background: 'rgba(255,255,255,0.2)',
        },
      }}
    >
      {item.name}
    </Button>
  ))}
            
            <IconButton  sx={{color:"black"}}>
              <NotificationsIcon />
            </IconButton>

            {isLoggedIn ? (
              <>
                <IconButton  sx={{color:"black"}} onClick={() => { navigate(path) }}>
                  <ProfileIcon />
                </IconButton>
                <Button   sx={{color:"black"}}   startIcon={<LogoutIcon />} onClick={handleLogout}   >
                  Logout
                </Button>
              </>
            ) : (
              <Button   sx={{color:"black"}}    startIcon={<LoginIcon />} onClick={() => {navigate("/auth");setIsLoggedIn(true)}} >   Login</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="temporary" open={mobileOpen}  onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{  display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },  }}  >
        {drawer}
      </Drawer>
    </Box>
  );
};

const Footer = () => {
  return (
    <Paper   component="footer" square   variant="outlined"   sx={{   background: 'white',    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',  py: 3,  px: 2,  marginTop: 'auto', bottom: 0 ,overflow:"hidden",position:"relative",zIndex:5 }} >
      <Container maxWidth="lg">
        <Box   sx={{    display: 'flex',    justifyContent: 'space-between',  alignItems: 'center'   }} >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} My App. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button size="small" color="primary">Privacy Policy</Button>
            <Button size="small" color="primary">Terms of Service</Button>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export { Navbar, Footer };