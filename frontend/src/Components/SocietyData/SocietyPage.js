import React, { useState, useEffect, useMemo } from 'react';
import {  Container,  TextField,  Grid,  Card,  CardMedia,  CardContent,  Typography,  Skeleton,  Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Memoized card component to prevent unnecessary re-renders
const SocietyCard = React.memo(({ society, onClick }) => (
  <Card  onClick={onClick} sx={{    height: '100%',   display: 'flex',  flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' },cursor: 'pointer' }} >
    <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
      <CardMedia component="img"  image={society.image}   alt={society.name}   loading="lazy"  sx={{  position: 'absolute', top: 0,  height: '100%',   width: '100%',  objectFit: 'cover'  }}  width={400} height={225}  />
    </Box>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography   variant="h6" component="h2"  gutterBottom sx={{    overflow: 'hidden',  textOverflow: 'ellipsis',  display: '-webkit-box',  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }} >
        {society.name}
      </Typography>
      <Typography   variant="body2"   color="text.secondary"  sx={{ overflow: 'hidden',textOverflow: 'ellipsis',  display: '-webkit-box',  WebkitLineClamp: 3,  WebkitBoxOrient: 'vertical'  }} >
        {society.description}
      </Typography>
    </CardContent>
  </Card>
));

const SkeletonCard = () => (
  <Card sx={{ height: '100%' }}>
    <Skeleton  variant="rectangular" sx={{ paddingTop: '56.25%' }}  animation="wave" />
    <CardContent>
      <Skeleton  variant="text"  sx={{ fontSize: '1.5rem', mb: 1 }}   animation="wave"  />
      <Skeleton  variant="text"     sx={{ fontSize: '1rem' }}  animation="wave"   count={2} />
    </CardContent>
  </Card>
);

const SocietyPage = () => {
  const [societies, setSocieties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/api/societies`);
        setSocieties(response.data);
      } catch (error) {
        console.error('Error fetching societies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  // Memoize filtered societies to prevent unnecessary recalculations
  const filteredSocieties = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return societies.filter(
      society => 
        society.name.toLowerCase().includes(term) || 
        society.description.toLowerCase().includes(term)
    );
  }, [societies, searchTerm]);

  return (
    <Container  maxWidth="lg"   sx={{   py: 4,  minHeight: '100vh' }} >
      <Box sx={{ mb: 4 }}>
        <TextField  label="Search Societies"  variant="outlined"   fullWidth onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 3 }}/>
      </Box>
      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <SkeletonCard />
            </Grid>
          ))
        ) : (
          filteredSocieties.map((society) => (
            <Grid item xs={12} sm={6} md={4} key={society._id}>
              <SocietyCard
                society={society}
                onClick={() => navigate(`/society/${society._id}`)}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default SocietyPage;