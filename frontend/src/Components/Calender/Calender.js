import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { Container, Typography, Box } from '@mui/material';

const UnifiedEventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/api/societies/events/all`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error.toJSON());
    }
  };

  const getEventsForDate = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    return events.filter(event => event.date.startsWith(formattedDate));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Unified Event Calendar
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={({ date, view }) => {
            if (view === 'month' && getEventsForDate(date).length) {
              return (
                <Box sx={{ backgroundColor: '#1976d2', color: 'white', borderRadius: '50%', padding: '5px', textAlign: 'center' }}>
                  {getEventsForDate(date).length}
                </Box>
              );
            }
          }}
        />
      </Box>
      <Typography variant="h5" align="center" gutterBottom>
        Events on {selectedDate.toDateString()}
      </Typography>
      <Box>
        {getEventsForDate(selectedDate).length ? (
          getEventsForDate(selectedDate).map(event => (
            <Box key={event._id} sx={{ marginBottom: 2, padding: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
              <Typography variant="h6">{event.title}</Typography>
              <Typography variant="body2">{event.description}</Typography>
              <Typography variant="caption">{new Date(event.date).toLocaleTimeString()}</Typography>
            </Box>
          ))
        ) : (
          <Typography align="center" color="text.secondary">
            No events for this date.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default UnifiedEventCalendar;
