import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Snackbar, Alert, Box } from '@mui/material';
import axios from 'axios';

const EMPTY = { title: '', date: '', description: '', image: '', venue: '', price: 'Free' };

// Event times are venue wall-clock times kept as UTC, so the form edits them without any timezone shift.
const toInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 16) : '');
const fromInput = (v) => (v ? `${v}:00.000Z` : v);

const EventCreation = ({ open, onClose, societyId, eventToEdit, onEventCreated, onEventUpdated }) => {
  const [formData, setFormData] = useState(EMPTY);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Pre-fill form when editing an event
  useEffect(() => {
    setFormData(eventToEdit ? {
      title: eventToEdit.title || '',
      date: toInput(eventToEdit.date),
      description: eventToEdit.description || '',
      image: eventToEdit.image || '',
      venue: eventToEdit.venue || '',
      price: eventToEdit.price || 'Free',
    } : EMPTY);
  }, [eventToEdit, open]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const headers = { Authorization: localStorage.getItem('token') };
    const body = { ...formData, date: fromInput(formData.date) };
    const url = `${process.env.REACT_APP_HOST_URL}/api/societies/${societyId}/events`;
    try {
      if (eventToEdit) {
        const response = await axios.put(`${url}/${eventToEdit._id}`, body, { headers });
        onEventUpdated?.(response.data);
      } else {
        const response = await axios.post(url, body, { headers });
        onEventCreated?.(response.data);
      }
      setToast({ open: true, message: eventToEdit ? 'Event updated' : 'Event created', severity: 'success' });
      onClose();
    } catch (error) {
      console.error('Error saving event:', error.response?.data || error.message);
      setToast({ open: true, message: [401, 403].includes(error.response?.status) ? 'Only admins can save events. Please log in as an admin.' : 'Could not save the event. Try again.', severity: 'error' });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800 }}>{eventToEdit ? 'Edit event' : 'Create event'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: '8px !important' }}>
          <TextField autoFocus label="Event title" fullWidth name="title" value={formData.title} onChange={handleChange} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField label="Date and time" type="datetime-local" fullWidth name="date" value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField label="Price" fullWidth name="price" value={formData.price} onChange={handleChange} helperText="e.g. Free or $5" />
          </Box>
          <TextField label="Venue" fullWidth name="venue" value={formData.venue} onChange={handleChange} />
          <TextField label="Description" fullWidth multiline rows={4} name="description" value={formData.description} onChange={handleChange} />
          <TextField label="Image URL" fullWidth name="image" value={formData.image} onChange={handleChange} helperText="A path like /images/music.jpg or a full link" />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{eventToEdit ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>{toast.message}</Alert>
      </Snackbar>
    </>
  );
};

export default EventCreation;
