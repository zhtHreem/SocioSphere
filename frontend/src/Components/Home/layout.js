import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Container, Paper } from '@mui/material';
import {  Home as HomeIcon,  NotificationsActive as NotificationsIcon, Info as AboutIcon,  People as SocietiesIcon,ContactMail as ContactIcon,  Person as ProfileIcon,  Login as LoginIcon, Logout as LogoutIcon, Menu as MenuIcon} from '@mui/icons-material';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate=useNavigate();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { name: 'Home', icon: <HomeIcon />, link: '/' },
    { name: 'About', icon: <AboutIcon />, link: '/about' },
    { name: 'Contact', icon: <ContactIcon />, link: '/contact' },
    { name: 'Societies', icon: <SocietiesIcon />, link: '/societies' },
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
            <ListItem button onClick={() => { navigate("/user") }}>
              <ListItemIcon><ProfileIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem onClick={() => setIsLoggedIn(false)}>
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
    <Box sx={{ display: 'flex', }}>
      <AppBar    position="fixed"  sx={{   background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',    boxShadow: '0 4px 6px rgba(0,0,0,0.1)' ,overflow:"hidden"}} >
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }} >

            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6"    component="div"  sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            SocioSphere
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button  key={item.name}  color="inherit"   startIcon={item.icon}
                sx={{   mx: 1, 
                  '&:hover': { 
                    background: 'rgba(255,255,255,0.2)'   }  }}  >
                {item.name}
              </Button>
            ))}
            
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>

            {isLoggedIn ? (
              <>
                <IconButton color="inherit" onClick={() => { navigate("/user") }}>
                  <ProfileIcon />
                </IconButton>
                <Button  color="inherit"   startIcon={<LogoutIcon />} onClick={() => setIsLoggedIn(false)}   >
                  Logout
                </Button>
              </>
            ) : (
              <Button    color="inherit"  startIcon={<LoginIcon />} onClick={() => {navigate("/auth");setIsLoggedIn(true)}} >   Login</Button>
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
    <Paper   component="footer" square   variant="outlined"   sx={{   backgroundColor: '#f5f5f5',  py: 3,  px: 2,  marginTop: 'auto', bottom: 0, width: '100%'  }} >
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