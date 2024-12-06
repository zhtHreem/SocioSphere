import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Button, Avatar, Grid, Card, CardContent, CardMedia, CardActions, Box } from '@mui/material';
import axios from 'axios';
import EventCreationDialog from './EventCreation';
import Chat from '../Chat/chat'; // Import the Chat component

const SocietyProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [society, setSociety] = useState({});
  const [events, setEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [chatOpen, setChatOpen] = useState(false); // State to control chatbox visibility

  useEffect(() => {
    console.log('Society ID from URL:', id);
    fetchSocietyDetails();
    fetchSocietyEvents(); // Fetch events
    fetchUserRole();
  }, [id]);

  const fetchSocietyDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/societies/${id}`);
      setSociety(response.data);
    } catch (error) {
      console.error('Error fetching society details:', error);
    }
  };

  const fetchSocietyEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/societies/${id}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchUserRole = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/profile', {}, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setUserRole(response.data.user.role); // Assuming the response contains the role
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const handleOpenDialog = (event = null) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
    setDialogOpen(false);
  };

  const handleEventCreated = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]); // Add the new event to the list
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event._id === updatedEvent._id ? updatedEvent : event))
    );
  };

  const toggleChat = () => {
    setChatOpen((prevChatOpen) => !prevChatOpen); // Toggle chatbox visibility
  };

  return (
    <Container>
      {/* Society Header */}
      <Grid container spacing={3} alignItems="center" sx={{ marginTop: 4 }}>
        <Grid item xs={12} sm={3} display="flex" justifyContent="center">
          <Avatar alt={society.name} src={society.image} sx={{ width: 150, height: 150 }} />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Typography variant="h4" gutterBottom sx={{ marginTop: 6, textAlign: 'center' }}>
            {society.name}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ textAlign: 'center' }}>
            {society.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 3 }}>
            <Button variant="contained" color="primary" onClick={() => navigate(`apply/${id}`)}>
              Apply for Membership
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate(`create/${id}`)}>
              Create Apply Form
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate(`position/${id}`)}>
              Positions
            </Button>
            {userRole === 'admin' && (
              <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                Create Event
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Event Creation/Edit Dialog */}
      <EventCreationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        societyId={id}
        eventToEdit={selectedEvent}
        onEventCreated={handleEventCreated}
        onEventUpdated={handleEventUpdated}
      />

      {/* Events Section */}
      <Typography variant="h5" sx={{ textAlign: 'center', marginTop: '40px' }}>
        Upcoming Events
      </Typography>

      <Grid container spacing={4} sx={{ marginTop: '15px', marginBottom: '15px' }}>
        {events.length ? (
          events.map((event) => (
            <Grid item key={event._id} xs={12} sm={6} md={4}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia component="img" height="140" image={event.image} alt={event.title} />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(event.date).toDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleOpenDialog(event)}>
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography sx={{ textAlign: 'center', width: '100%', mt: 2 }}>
            No events scheduled.
          </Typography>
        )}
      </Grid>

      {/* Chat Button */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleChat}
        >
          {chatOpen ? 'Close Chat' : 'Open Chat'}
        </Button>
      </Box>

      {/* Chat Section */}
      {chatOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            width: '350px',
            height: '400px',
            backgroundColor: 'white',
            boxShadow: 3,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Chat societyId={id} />
        </Box>
      )}
    </Container>
  );
};

export default SocietyProfile;
