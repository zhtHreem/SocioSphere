import React, { useState } from 'react';
import { Container, TextField, Button, Snackbar, Typography, Box } from '@mui/material';
import axios from 'axios';

const AddSocietyForm = () => {
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/societies/add', formData);
      setOpenSnackbar(true);
      setFormData({ name: '', description: '', image: '' });
    } catch (error) {
      console.error('Error adding society:', error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffff',
        padding: '20px',
        position: 'relative',
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: '#f9f9f9',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          mt: 4,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Add Society
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <TextField
            label="Description"
            name="description"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            value={formData.description}
            required
          />
          <TextField
            label="Image URL"
            name="image"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            value={formData.image}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Add Society
          </Button>
        </form>
      </Container>

      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Society added successfully!"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />

      <Box
        component="img"
        src="https://i.pinimg.com/originals/c8/8a/c7/c88ac78ed012b6b98b634297c58c8c8f.gif"
        alt="Floating GIF"
        sx={{
          position: 'fixed',
          bottom: 40,
          right: 50,
          width: '150px',
          height: '150px',
          zIndex: 1000,
        }} 
        />

<Box
        component="img"
        src="https://bestanimations.com/Animals/Mammals/Cats/cats/cute-kitty-animated-gif-29.gif"
        alt="Floating GIF"
        sx={{
          position: 'fixed',
          bottom: 40,
          left: 80,
          width: '150px',
          height: '150px',
          zIndex: 1000,
        }} 
        />
    </Box>

    
  );
};

export default AddSocietyForm;
