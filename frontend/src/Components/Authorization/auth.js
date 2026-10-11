import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Alert, Box, Button, TextField, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { photo, PHOTOS, fmtDate, splitEvents } from '../Home/ui';
import Snackbar from '@mui/material/Snackbar';

import axios from "axios";
const AuthPage = () => {
  const navigate=useNavigate();
  const [searchParams] = useSearchParams();
  // only follow same-site paths so the link cannot bounce people to another website
  const rawNext = searchParams.get('next') || '/';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [activeTab, setActiveTab] = useState(searchParams.get('mode') === 'signup' ? 1 : 0);
  const [coming, setComing] = useState([]);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HOST_URL}/api/societies/events/all`)
      .then((r) => setComing(splitEvents(Array.isArray(r.data) ? r.data : []).upcoming.slice(0, 3)))
      .catch(() => {});
  }, []);
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
      const response = await axios.post(`${process.env.REACT_APP_HOST_URL}/api/login`, loginData);
      // Save JWT Token (Consider using HttpOnly cookies for better security)
      localStorage.setItem("token", response.data.token);
          setSnackbarMessage('Login successfully!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);

          navigate(next);
    } catch (err) {
           setSnackbarMessage(err.response?.data?.message || 'Error Loggingin');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
    }
  };


  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setSnackbarMessage('Passwords do not match');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_HOST_URL}/api/register`, {
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
      });

      setSnackbarMessage('Account created. Log in to continue.');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          setLoginData({ email: signupData.email, password: '' });
          setActiveTab(0);
    } catch (err) {
   
       setSnackbarMessage(err.response?.data?.message || '"Sign up failed! Please try again."');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
    }
  };
  const commonTextFieldProps = {
    margin: "normal", required: true, fullWidth: true, variant: "outlined",
  };

  const commonButtonProps = {
    fullWidth: true, variant: "contained", size: "large",
    sx: { mt: 2, mb: 1, py: 1.5, background: 'var(--ink)', boxShadow: 'none', '&:hover': { background: '#1c2027', boxShadow: 'none' } }
  };

  return (
    <Box sx={{ width: 'calc(100% - 32px)', maxWidth: 1120, mx: 'auto', my: { xs: 1, md: 3 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' }, borderRadius: { xs: 5, md: 7 }, overflow: 'hidden', background: '#fff', boxShadow: '0 50px 90px -50px rgba(18,20,24,.55)' }}>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>{snackbarMessage}</Alert>
      </Snackbar>

      {/* left: a real photo and what is actually happening */}
      <Box sx={{ position: 'relative', display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'flex-end', minHeight: 680, color: '#fff', background: 'var(--ink)' }}>
        <Box component="img" src={photo(PHOTOS.friends)} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,20,24,.15) 0%, rgba(18,20,24,.55) 45%, rgba(18,20,24,.94) 100%)' }} />
        <Box sx={{ position: 'relative', p: 5 }}>
          <Box component="h1" sx={{ m: 0, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.98, fontSize: '3.4rem' }}>
            {activeTab === 0 ? 'Good to see you again.' : 'Your people are already here.'}
          </Box>
          {coming.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Box sx={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', opacity: 0.7, mb: 1 }}>Happening soon</Box>
              {coming.map((e) => (
                <Box key={e._id} sx={{ display: 'flex', gap: 2, py: 1.2, borderTop: '1px solid rgba(255,255,255,.22)' }}>
                  <Box sx={{ width: 54, flexShrink: 0, lineHeight: 1.05 }}>
                    <Box sx={{ fontSize: 12, fontWeight: 800, color: 'var(--butter)' }}>{fmtDate.monthShort(e.date)}</Box>
                    <Box sx={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, fontSize: 28 }}>{fmtDate.day(e.date)}</Box>
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ fontWeight: 800, lineHeight: 1.25 }}>{e.title}</Box>
                    <Box sx={{ fontSize: 14, opacity: 0.75 }}>{[e.society?.name, e.city].filter(Boolean).join(' · ')}</Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* right: the form */}
      <Box sx={{ p: { xs: 3, sm: 5, md: 7 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', gap: 3, mb: 4, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: '-0.02em' }}>
          {['Log in', 'Sign up'].map((label, i) => (
            <Box key={label} component="button" onClick={() => setActiveTab(i)} sx={{ border: 0, background: 'none', cursor: 'pointer', p: 0, pb: 0.6, font: 'inherit', color: activeTab === i ? 'var(--ink)' : 'rgba(18,20,24,.35)', borderBottom: activeTab === i ? '4px solid var(--rose)' : '4px solid transparent', transition: 'color .2s' }}>{label}</Box>
          ))}
        </Box>

        {activeTab === 0 ? (
          <Box component="form" onSubmit={handleLoginSubmit} sx={{ width: '100%' }}>
            <TextField {...commonTextFieldProps} id="login-email" label="Email address" name="email" value={loginData.email} onChange={handleLoginChange} autoComplete="email" />
            <TextField {...commonTextFieldProps} name="password" label="Password" value={loginData.password} onChange={handleLoginChange} type={showPassword ? 'text' : 'password'} id="login-password" autoComplete="current-password"
              InputProps={{ endAdornment: (<IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label="Show password">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>) }}
            />
            <Button {...commonButtonProps} type="submit">Log in</Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSignupSubmit} sx={{ width: '100%' }}>
            <TextField {...commonTextFieldProps} id="signup-username" label="Your name" name="username" value={signupData.username} onChange={handleSignupChange} autoComplete="name" />
            <TextField {...commonTextFieldProps} id="signup-email" label="Email address" name="email" autoComplete="email" value={signupData.email} onChange={handleSignupChange} error={!!errors.signupEmail} helperText={errors.signupEmail} />
            <TextField {...commonTextFieldProps} value={signupData.password} onChange={handleSignupChange} name="password" label="Password" type={showPassword ? 'text' : 'password'} id="signup-password" autoComplete="new-password" error={!!errors.signupPassword} helperText={errors.signupPassword || 'At least 8 characters'}
              InputProps={{ endAdornment: (<IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label="Show password">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>) }}
            />
            <TextField {...commonTextFieldProps} value={signupData.confirmPassword} onChange={handleSignupChange} name="confirmPassword" label="Confirm password" type={showPassword ? 'text' : 'password'} id="signup-confirm-password" autoComplete="new-password" error={!!errors.signupConfirmPassword} helperText={errors.signupConfirmPassword} />
            <Button {...commonButtonProps} type="submit">Create account</Button>
          </Box>
        )}

        <Box sx={{ mt: 3, color: 'text.secondary', fontSize: 15 }}>
          Just looking around? <Box component={Link} to="/society" sx={{ color: 'var(--ink)', fontWeight: 800 }}>Browse the societies</Box>. You only need an account to join, chat or RSVP.
        </Box>
      </Box>
    </Box>
  );
};

export { AuthPage };