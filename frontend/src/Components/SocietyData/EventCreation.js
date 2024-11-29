import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Snackbar } from '@mui/material';
import axios from 'axios';

const EventCreation = ({ open, onClose, societyId, eventToEdit, onEventUpdated }) => {
  const [formData, setFormData] = useState({ title: '', date: '', description: '', image: '' });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Pre-fill form when editing an event
  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || '',
        date: eventToEdit.date || '',
        description: eventToEdit.description || '',
        image: eventToEdit.image || '',
      });
    } else {
      setFormData({ title: '', date: '', description: '', image: '' });
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (eventToEdit) {
        // Update existing event
        await axios.put(`http://localhost:5000/api/societies/${societyId}/events/${eventToEdit._id}`, formData);
        onEventUpdated(formData);
      } else {
        // Create new event
        const data = new FormData();
        data.append('title', formData.title);
        data.append('date', formData.date);
        data.append('description', formData.description);
        data.append('image', formData.image);

        const response = await axios.post(`http://localhost:5000/api/societies/${societyId}/events`, data);
        onEventUpdated(response.data);
      }

      setOpenSnackbar(true);
      setFormData({ title: '', date: '', description: '', image: '' });
      onClose();
    } catch (error) {
      console.error('Error saving event:', error.response?.data || error.message);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{eventToEdit ? 'Edit Event' : 'Create Event'}</DialogTitle>
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
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {eventToEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={eventToEdit ? 'Event updated successfully!' : 'Event created successfully!'}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </>
  );
};

export default EventCreation;
