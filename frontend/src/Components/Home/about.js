import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, Paper, useTheme, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { Message as MessageIcon, Group as GroupIcon, Event as EventIcon, Search as SearchIcon, Notifications as NotificationsIcon, Add as AddIcon, School as SchoolIcon, Business as BusinessIcon, Diversity3 as CultureIcon, Groups as InterestIcon, Home as ResidentialIcon } from '@mui/icons-material';
import { Navbar, Footer } from './layout';
const AboutPage = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <GroupIcon fontSize="large" color="primary" />,
      title: "Powerful Administration Tools",
      description: "Take control of your society's destiny with our comprehensive management suite. Create custom hierarchies, design tailored application processes, and organize events that bring your community together."
    },
    {
      icon: <MessageIcon fontSize="large" color="primary" />,
      title: "Dynamic Real-Time Communication",
      description: "Foster meaningful connections through dedicated society chatrooms. Watch your community come alive with instant discussions, collaborative projects, and shared moments."
    },
    {
      icon: <EventIcon fontSize="large" color="primary" />,
      title: "Streamlined Membership Management",
      description: "Say goodbye to complicated application processes. Our intuitive membership tracker ensures smooth onboarding while maintaining your society's standards."
    }
  ];

  const smartFeatures = [
    {
      icon: <SearchIcon />,
      title: "Intelligent Search",
      description: "Find exactly what you're looking for with our powerful search functionality."
    },
    {
      icon: <NotificationsIcon />,
      title: "Stay in the Loop",
      description: "Never miss important updates with our smart notification system."
    },
    {
      icon: <AddIcon />,
      title: "Seamless Organization",
      description: "Create and manage events that bring your community together."
    }
  ];

  const communityTypes = [
    { icon: <SchoolIcon />, label: "Student Organizations" },
    { icon: <BusinessIcon />, label: "Professional Associations" },
    { icon: <CultureIcon />, label: "Cultural Groups" },
    { icon: <InterestIcon />, label: "Special Interest Communities" },
    { icon: <ResidentialIcon />, label: "Residential Societies" }
  ];

  return (
    <>
    <Navbar/>
   
    <Box>
      {/* Hero Section */}
     
      {/* Main Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Your All-in-One Society Management Solution
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom align="center">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Smart Features */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            Smart Features for Modern Communities
          </Typography>
          <List>
            {smartFeatures.map((feature, index) => (
              <ListItem key={index} sx={{ mb: 2 }}>
                <ListItemIcon>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 1, 
                      color: theme.palette.primary.main,
                      borderRadius: '50%' 
                    }}
                  >
                    {feature.icon}
                  </Paper>
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography variant="h6">{feature.title}</Typography>}
                  secondary={feature.description}
                />
              </ListItem>
            ))}
          </List>
        </Container>
      </Box>

      {/* Community Types */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Built for Today's Connected World
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 4 }}>
          SocioSphere understands that modern societies need modern solutions. Our platform combines powerful features with an intuitive interface, making it perfect for:
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {communityTypes.map((type, index) => (
            <Grid item key={index}>
              <Chip
                icon={type.icon}
                label={type.label}
                sx={{ 
                  py: 3,
                  px: 2,
                  '& .MuiChip-icon': { 
                    fontSize: 24,
                    marginLeft: 1
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: theme.palette.primary.main, color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            Join the future of community management
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Experience the power of SocioSphere today
          </Typography>
          <Box display="flex" justifyContent="center">
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.grey[100]
                }
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ borderTop: 1, borderColor: 'divider', py: 4 }}>
        <Typography variant="body1" align="center" color="text.secondary" component="p">
          SocioSphere: Building Stronger Communities Together
        </Typography>
      </Box>
    </Box>
     <Footer/></>
  );
};

export default AboutPage;