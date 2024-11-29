import React from 'react'; import { motion } from 'framer-motion'; import { Box, Typography, Button, Grid } from '@mui/material'; import { FaSun, FaGuitar, FaRunning, FaHandshake } from 'react-icons/fa';

const AnimatedIcon = ({ icon: Icon, delay = 0, color = "#000" }) => <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ rotateX: 15, rotateY: 15, scale: 1.2, transition: { type: "spring", stiffness: 300, damping: 10 } }} transition={{ duration: 0.5, delay, type: "spring", stiffness: 170, damping: 10 }}><Icon size={48} style={{ color }} /></motion.div>;

const SociosphereHomepage = () => {
  const iconVariants = [{ Icon: FaSun, delay: 0.2, color: "#FFD700" }, { Icon: FaGuitar, delay: 0.4, color: "#8B4513" }, { Icon: FaRunning, delay: 0.6, color: "#FF4500" }, { Icon: FaHandshake, delay: 0.8, color: "#1E90FF" }];
  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <Box py={8} textAlign="center" sx={{ backgroundColor: "#50727B", color: "#526E48", height: "50vh", position: "relative" }}>
          <Box component="img" src={require("./images/home.png")} sx={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0 }} />
          <Typography variant="h3" gutterBottom sx={{ position: "relative", zIndex: 1, fontWeight: "bold", textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)", padding: "10px", borderRadius: "8px", color: "#FFF6E9" }}>Welcome to Sociosphere</Typography>
          <Typography variant="body1" sx={{position: "relative", zIndex: 1, maxWidth: 600, mx: "auto",color: "#FFF6E9",textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)"  }}>Connect with like-minded students, explore new interests, and get involved in campus life.</Typography>
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 120 }}>
            <Button variant="contained" color="secondary" size="large" sx={{ mt: 4 }}>Join Now</Button>
          </motion.div>
        </Box>
      </motion.div>
      <Grid container spacing={4} sx={{ px: 4, py: 6 }}>
        {iconVariants.map(({ Icon, delay, color }, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box textAlign="center">
              <AnimatedIcon icon={Icon} delay={delay} color={color} />
              <Typography variant="h5" gutterBottom><motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.5 }}>{index === 0 && "Clubs"}{index === 1 && "Events"}{index === 2 && "Volunteer"}{index === 3 && "Connect"}</motion.span></Typography>
              <Typography variant="body2"><motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.7 }}>{index === 0 && "Explore our wide range of student clubs."}{index === 1 && "Attend exciting campus events and activities."}{index === 2 && "Give back to the community through volunteering."}{index === 3 && "Network and collaborate with other students."}</motion.span></Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SociosphereHomepage;
