import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Avatar, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import axios from 'axios';
import EventCreationDialog from './EventCreation';

const SocietyProfile = () => {
  const { id } = useParams();
  const [society, setSociety] = useState({});
  const [events, setEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    console.log('Society ID from URL:', id);
    fetchSocietyDetails();
    fetchSocietyEvents(); // Fetch events
  }, [id]);

  // Fetch society details (name, description, image)
  const fetchSocietyDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/societies/${id}`);
      setSociety(response.data);
    } catch (error) {
      console.error('Error fetching society details:', error);
    }
  };

  // Fetch events for the society
  const fetchSocietyEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/societies/${id}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEventCreated = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]); // Add the new event to the list
  };

  return (
    <Container>
      {/* Society Header */}
      <Grid container spacing={3} alignItems="center" sx={{ marginTop: 4 }}>
        <Grid item xs={12} sm={3} display="flex" justifyContent="center">
          <Avatar
            alt={society.name}
            src={society.image}
            sx={{ width: 150, height: 150 }}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Typography variant="h4" gutterBottom sx={{ marginTop: 6, textAlign: 'center' }}>
            {society.name}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ textAlign: 'center' }}>
            {society.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 3 }}>
            <Button variant="contained" color="primary">
              Apply for Membership
            </Button>
            <Button variant="outlined" color="secondary">
              RSVP for Events
            </Button>
        <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
          Create Event
        </Button>
        </Box>
        </Grid>
        </Grid>

      <EventCreationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        societyId={id}
        onEventCreated={handleEventCreated}
      />

      {/* Events Section */}
      <Typography variant="h5" sx={{ textAlign: 'center', marginTop: '40px' }}>
        Upcoming Events
      </Typography>
      
      <Grid container spacing={4} sx={{ marginTop: '20px' }}>
        {events.length ? (
          events.map((event) => (
            <Grid item key={event._id} xs={12} sm={6} md={4}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={event.image}
                  alt={event.title}
                />
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
              </Card>
            </Grid>
          ))
        ) : (
          <Typography sx={{ textAlign: 'center', width: '100%', mt: 2 }}>
            No events scheduled.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default SocietyProfile;
