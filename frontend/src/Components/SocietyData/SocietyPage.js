import React, { useState, useEffect } from 'react';
import { Container, TextField, Grid, Card, CardMedia, CardContent, Typography, Backdrop, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SocietyPage = () => {
  const [societies, setSocieties] = useState([]);
  const [filteredSocieties, setFilteredSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://socio-sphere-api-sooty.vercel.app/api/societies');
      setSocieties(response.data);
      setFilteredSocieties(response.data);
    } catch (error) {
      console.error('Error fetching societies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = societies.filter((society) =>
      society.name.toLowerCase().includes(searchTerm) || society.description.toLowerCase().includes(searchTerm)
    );
    setFilteredSocieties(filtered);
  };

  const handleCardClick = (id) => {
    navigate(`/society/${id}`); // Navigate to SocietyProfile with ID
  };

  return (
    <Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {!loading && (
        <>
          <TextField label="Search Societies" variant="outlined" fullWidth margin="normal" onChange={handleSearch} />
          <Grid container spacing={3}>
            {filteredSocieties.map((society) => (
              <Grid item xs={12} sm={6} md={4} key={society._id}>
                <Card onClick={() => handleCardClick(society._id)} sx={{ cursor: 'pointer' , marginBottom: '10px' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={society.image}
                    alt={society.name}
                  />
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {society.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {society.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default SocietyPage;
