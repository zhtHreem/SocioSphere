import React, { useState,useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert,Box, Button, Container, TextField, Typography, Paper, Tab, Tabs, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Visibility, VisibilityOff, Favorite, Star, Pets, Cake, AutoFixHigh, CatchingPokemon,Beenhere, Article, People } from '@mui/icons-material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Snackbar from '@mui/material/Snackbar';

import axios from "axios";
const BackgroundIcons = () => {
  const icons = [Favorite, Star, Pets, Article, AutoFixHigh, People, Beenhere];
  const colors = ['#FFB6C1', '#FF69B4', '#FFC0CB', '#FF85A2', '#FFD1DC', 'black', '#FF6B6B', '#FFD700'];

  const iconElements = useMemo(() => {
    return [...Array(50)].map((_, index) => {
      const IconComponent = icons[index % icons.length];
      const color = colors[index % colors.length];
      const size = Math.random() * 50 + 20;

      // Pre-calculate random positions and animation delays
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const animationDelay = `${Math.random() * 5}s`;
      const transformTranslate = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`;

      return (
        <Box key={index}
          sx={{ position: 'absolute',  color,  opacity: 0.2,    top, left, transform: 'rotate(45deg)',  animation: `float 10s infinite`,
            animationDelay,  '@keyframes float': {    '0%': { transform: 'translate(0, 0) rotate(45deg)' },   '50%': { transform: transformTranslate + ' rotate(45deg)' },  '100%': { transform: 'translate(0, 0) rotate(45deg)' }     }  }}  >
          <IconComponent sx={{ fontSize: size }} />
        </Box>
      );
    });
  }, []);

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden', zIndex: 3 }}>
      {iconElements}
    </Box>
  );
};


const AuthPage = () => {
  const navigate=useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
    // Separate state for login and signup
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  // Add validation states
  const [errors, setErrors] = useState({
    loginEmail: '',
    loginPassword: '',
    signupEmail: '',
    signupPassword: '',
    signupConfirmPassword: ''
  });
  // Email validation function
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Password validation function
  const validatePassword = (password) => {
    return password.length >= 8;
  };


   const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
 const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prevData => ({ ...prevData, [name]: value }));
    
    // Validate on change
    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        signupEmail: !validateEmail(value) ? 'Please enter a valid email address' : ''
      }));
    }
    if (name === 'password') {
      setErrors(prev => ({
        ...prev,
        signupPassword: !validatePassword(value) ? 'Password must be at least 8 characters long' : ''
      }));
    }
    if (name === 'confirmPassword') {
      setErrors(prev => ({
        ...prev,
        signupConfirmPassword: value !== signupData.password ? 'Passwords do not match' : ''
      }));
    }
  };


   const handleLoginSubmit = async (e) => {
    
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", loginData);
      // Save JWT Token (Consider using HttpOnly cookies for better security)
      localStorage.setItem("token", response.data.token);
          setSnackbarMessage('Login successfully!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);

          navigate('/');
    } catch (err) {
           setSnackbarMessage(err.response?.data?.message || 'Error Loggingin');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
    }
  };


  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
      });

      setSnackbarMessage('Sign up successful! You can now log in.');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
    } catch (err) {
   
       setSnackbarMessage(err.response?.data?.message || '"Sign up failed! Please try again."');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
    }
  };
  const commonTextFieldProps = {
    margin: "normal", required: true, fullWidth: true, variant: "outlined",
    sx: { '& .MuiOutlinedInput-root': { borderRadius: 3, '&:hover fieldset': { borderColor: '#1A3636' }, '&.Mui-focused fieldset': { borderColor: '#1A3659' } } }
  };

  const commonButtonProps = {
    fullWidth: true, variant: "contained",
    sx: { mt: 3, mb: 2, borderRadius: 3, background: 'linear-gradient(45deg, #1A3636 30%, #FF85A2 90%)', '&:hover': { background: 'linear-gradient(45deg, #FF85A2 30%, #1A3636 90%)' } }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #9AC8CD 0%, #FFEBCD 100%)', overflow: 'hidden' }}>
      <BackgroundIcons />
       <Snackbar   open={openSnackbar}   autoHideDuration={6000}  onClose={handleCloseSnackbar}    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  >
                <Alert   onClose={handleCloseSnackbar}  severity={snackbarSeverity}  sx={{ width: '100%' }}    >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 4 }}>
        <Paper elevation={6} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 4, background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 8px 32px 0 rgba(255, 192, 203, 0.37)' }}>
          <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#1A3636', display: 'flex', alignItems: 'center' }}>
            Authorization <VerifiedUserIcon  sx={{ ml: 1, color: '#1A3636' }} />
          </Typography>

          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2, '& .MuiTab-root': { color: '#1A3636' } }}>
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          {activeTab === 0 ? (
            <Box component="form" sx={{ width: '100%' }}>
              <TextField {...commonTextFieldProps} id="login-email" label="Email Address" name="email" value={loginData.email} onChange={handleLoginChange} autoComplete="email" />
              <TextField {...commonTextFieldProps} name="password" label="Password" value={loginData.password} onChange={handleLoginChange} type={showPassword ? 'text' : 'password'} id="login-password" autoComplete="current-password" 
                InputProps={{ endAdornment: (<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>)}} 
              />
              <Button {...commonButtonProps} type="submit" onClick={handleLoginSubmit}>Login <Star sx={{ ml: 1, fontSize: 'small' }} /></Button>
            </Box>
          ) : (
            <Box component="form" sx={{ width: '100%' }}>
              <TextField {...commonTextFieldProps} id="signup-username" label="Username" name="username" value={signupData.username} onChange={handleSignupChange} />
              <TextField {...commonTextFieldProps} id="signup-email" label="Email Address" name="email" autoComplete="email" value={signupData.email}  onChange={handleSignupChange} error={!!errors.signupEmail}   helperText={errors.signupEmail}/>
              <TextField {...commonTextFieldProps} value={signupData.password} onChange={handleSignupChange} name="password" label="Password" type={showPassword ? 'text' : 'password'} id="signup-password" autoComplete="new-password" error={!!errors.signupPassword}                helperText={errors.signupPassword}
                InputProps={{ endAdornment: (<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>) }} 
              />
              <TextField {...commonTextFieldProps} value={signupData.confirmPassword} onChange={handleSignupChange} name="confirmPassword" label="Confirm Password" type={showPassword ? 'text' : 'password'} id="signup-confirm-password" />
              <Button {...commonButtonProps} type="submit" onClick={handleSignupSubmit}>Sign Up <Star sx={{ ml: 1, fontSize: 'small' }} /></Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export { AuthPage,BackgroundIcons};