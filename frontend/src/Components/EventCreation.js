import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Snackbar } from '@mui/material';
import axios from 'axios';

const EventCreation = ({ open, onClose, societyId, onEventCreated }) => {
  const [formData, setFormData] = useState({ title: '', date: '', description: '', image: '' });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`http://localhost:5000/api/societies/${societyId}/events`, formData);
      onEventCreated(response.data);

      // Reset form and show success snackbar
      setFormData({ title: '', date: '', description: '', image: '' });
      setOpenSnackbar(true);
      onClose();
    } catch (error) {
      console.error('Error creating event:', error.response?.data || error.message);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Event Date"
            type="date"
            fullWidth
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreateEvent} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Event created successfully!"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </>
  );
};

export default EventCreation;
