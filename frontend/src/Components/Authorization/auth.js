import React, { useState,useMemo } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, Tab, Tabs, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Visibility, VisibilityOff, Favorite, Star, Pets, Cake, AutoFixHigh, CatchingPokemon,Beenhere, Article, People } from '@mui/icons-material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
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
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
    // Separate state for login and signup
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '', confirmPassword: '' });

 const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
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
              <Button {...commonButtonProps} type="submit">Login <Star sx={{ ml: 1, fontSize: 'small' }} /></Button>
            </Box>
          ) : (
            <Box component="form" sx={{ width: '100%' }}>
              <TextField {...commonTextFieldProps} id="signup-username" label="Username" name="username" value={signupData.username} onChange={handleSignupChange} />
              <TextField {...commonTextFieldProps} id="signup-email" label="Email Address" name="email" autoComplete="email" value={signupData.email}  onChange={handleSignupChange} />
              <TextField {...commonTextFieldProps} value={signupData.password} onChange={handleSignupChange} name="password" label="Password" type={showPassword ? 'text' : 'password'} id="signup-password" autoComplete="new-password" 
                InputProps={{ endAdornment: (<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>) }} 
              />
              <TextField {...commonTextFieldProps} value={signupData.confirmPassword} onChange={handleSignupChange} name="confirm-password" label="Confirm Password" type={showPassword ? 'text' : 'password'} id="signup-confirm-password" />
              <Button {...commonButtonProps} type="submit">Sign Up <Star sx={{ ml: 1, fontSize: 'small' }} /></Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export { AuthPage,BackgroundIcons};