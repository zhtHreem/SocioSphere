import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container,Typography,Button,Avatar, Grid,Card,CardContent,CardMedia, CardActions, Box,Paper,Fade,Chip,IconButton,Divider,useTheme,useMediaQuery} from '@mui/material';
import {Edit as EditIcon,Event as EventIcon,Chat as ChatIcon, Close as CloseIcon,Person as PersonIcon, Add as AddIcon} from '@mui/icons-material';
import Groups2Icon from '@mui/icons-material/Groups2';
import axios from 'axios';
import EventCreationDialog from './EventCreation';
import Chat from '../Chat/chat';

const SocietyProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { id } = useParams();
  const [society, setSociety] = useState({});
  const [events, setEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetchSocietyDetails();
    fetchSocietyEvents();
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
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event._id === updatedEvent._id ? updatedEvent : event))
    );
  };

  const toggleChat = () => {
    setChatOpen((prev) => !prev);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ mt: 4, p: 3, borderRadius: 2, background: '#22092C', color: 'white' }} >

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={3} display="flex" justifyContent="center">
           <Avatar alt={society.name} src={society.image} sx={{ width: 180, height: 180, border: '4px solid white', boxShadow: theme.shadows[3] }} />
          </Grid>
          <Grid item xs={12} sm={9}>
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {society.name}
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              {society.description}
            </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
  <Button variant="contained" startIcon={<PersonIcon />} onClick={() => navigate(`apply/${id}`)} sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}>Apply for Membership</Button>
  <Button variant="outlined" color="inherit" startIcon={<Groups2Icon />} onClick={() => navigate(`position/${id}`)} sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>Positions</Button>
  {userRole === 'admin' && (
    <>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}>Create Event</Button>
      <Button variant="outlined" color="inherit" startIcon={<EditIcon />} onClick={() => navigate(`create/${id}`)} sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>Create Apply Form</Button>
    </>
  )}
</Box>

          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 3 }}>
          <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Upcoming Events
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          {events.length ? (
            events.map((event) => (
              <Grid item key={event._id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[8] } }} >

                  <CardMedia  component="img"  height="200"  image={event.image}  alt={event.title}   sx={{ objectFit: 'cover' }} />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6">
                      {event.title}
                    </Typography>
                   <Chip label={new Date(event.date).toLocaleDateString()} color="primary" size="small" sx={{ mb: 2 }} />

                    <Typography variant="body2" color="text.secondary">
                      {event.description}
                    </Typography>
                  </CardContent>
                  {userRole === 'admin' && (
                    <CardActions>
                      <Button   size="small"  startIcon={<EditIcon />} onClick={() => handleOpenDialog(event)}>
                        Edit Event
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="h6" color="text.secondary">
                  No events scheduled at the moment.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      <EventCreationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        societyId={id}
        eventToEdit={selectedEvent}
        onEventCreated={handleEventCreated}
        onEventUpdated={handleEventUpdated}
      />

      <Fade in={chatOpen}>
       <Box sx={{ position: 'fixed', bottom: 80, right: 16, width: isMobile ? '100%' : '350px', height: '400px', bgcolor: 'background.paper', boxShadow: theme.shadows[8], borderRadius: 2, overflow: 'hidden', ...(isMobile && { right: 0, bottom: 0, width: '100%', height: '100%' }) }} >

          <Box sx={{ p: 1, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >

            <Typography variant="subtitle1">Society Chat</Typography>
            <IconButton size="small" onClick={toggleChat} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Chat societyId={id} />
        </Box>
      </Fade>

      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Button variant="contained" color="primary" startIcon={<ChatIcon />} onClick={toggleChat} sx={{ borderRadius: '28px', px: 3, py: 1.5, boxShadow: theme.shadows[4] }} >
          {chatOpen ? 'Close Chat' : 'Open Chat'}
        </Button>
      </Box>
    </Container>
  );
};

export default SocietyProfile;