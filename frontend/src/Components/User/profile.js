import React, { useState, useEffect } from "react";
import { Box, Avatar, Typography, Stack, Card, CardHeader, CardContent, Badge, Container, Grid as MuiGrid, IconButton, Tooltip, Divider, CardMedia, CardActionArea, Chip, LinearProgress } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from "axios";
import ApplicationTracker from "../SocietyData/ApplicationTracker";
import Groups2Icon from '@mui/icons-material/Groups2';

function User() {
  const [user, setUser] = useState([])
    const [societies, setSocieties] = useState([]);
    const [userSocieties, setUserSocieties] = useState([]);
    const [selectedTab, setSelectedTab] = useState('one');
    const [selectedSociety, setSelectedSociety] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchSocieties = async () => {
            try {
                const response = await axios.get('https://socio-sphere-api-sooty.vercel.app/api/societies/allsocietyresponses', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                });

                if (response.data.length > 0) {
                    const filteredSocieties = response.data.filter(society =>
                        userSocieties.some(userSociety => userSociety.societyName === society.name)
                    );

                    setSocieties(filteredSocieties);
                    setSelectedTab(filteredSocieties[0]?.name);
                    setSelectedSociety(filteredSocieties[0]);
                }
            } catch (error) {
                console.error("Error fetching societies", error);
            }
        };

        fetchSocieties();
    }, [userSocieties]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('https://socio-sphere-api-sooty.vercel.app/api/user/allsociety', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                });

                if (response.data) {
                    setUser(response.data.user);
                    setUserSocieties(response.data.societies)
                }
            } catch (error) {
                console.error("Error fetching societies", error);
            }
        };

        fetchUser();
    }, []);

    const handleTabChange = (event, newValue) => {
        const selectedSoc = societies.find(society => society.name === newValue);
        setSelectedTab(newValue);
        setSelectedSociety(selectedSoc);
    };

    const handleFormSelect = (form) => {
        setSelectedForm(form);
        setIsModalOpen(true);
    };
    const getRandomPastelColor = () => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 85%)`;
    };

    // Function to get membership duration
    const getMembershipDuration = (joinDate) => {
        const joined = new Date(joinDate);
        const now = new Date();
        const diffYears = now.getFullYear() - joined.getFullYear();
        const diffMonths = now.getMonth() - joined.getMonth();
        
        if (diffYears > 0) return `${diffYears} ${diffYears === 1 ? 'year' : 'years'}`;
        if (diffMonths > 0) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'}`;
        return 'Less than a month';
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Enhanced Profile Header Section */}
            <Box sx={{
                background: 'linear-gradient(135deg, #001524 10%, #445D48 90%)', pt: 8,pb: 20,  marginTop: '-20px', position: 'relative', '&::after': {   content: '""',position: 'absolute', bottom: 0,  left: 0, right: 0,      height: '100px',     background: 'linear-gradient(to top left, #f5f5f5 50%, transparent 51%)'    } }}>
                <Container maxWidth="lg">
                    <Stack spacing={4}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <Tooltip title={`Member of ${userSocieties.length} societies`}>
                                        <Avatar  sx={{  width: 40,  height: 40,  bgcolor: '#FBA834', border: '2px solid white' }} >
                                            <GroupIcon />
                                        </Avatar>
                                    </Tooltip>
                                }     >
                                <Avatar  sx={{ width: 120, height: 120,  bgcolor: '#FBA834', border: '4px solid rgba(255,255,255,0.2)',  transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }} >
                                    <PersonIcon sx={{ fontSize: 60 }} />
                                </Avatar>
                            </Badge>
                            <Box sx={{ color: 'white', textAlign: { xs: 'center', sm: 'left' } }}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    {user.name}
                                </Typography>
                                <Stack direction="row" spacing={3} flexWrap="wrap" justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <CalendarTodayIcon sx={{ fontSize: 18 }} />
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Member for {getMembershipDuration(user.Joiningdate)}
                                        </Typography>
                                    </Stack>
                                    {user.email && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <EmailIcon sx={{ fontSize: 18 }} />
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                {user.email}
                                            </Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </Box>
                        </Stack>

                        {/* Society Stats */}
                        <Box sx={{ width: '100%', mt: 4 }}>
                            <LinearProgress variant="determinate"   value={(userSocieties.length / 10) * 100}  sx={{   height: 10,  borderRadius: 5,backgroundColor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { backgroundColor: '#FBA834'}  }}  />
                            <Typography variant="caption" sx={{ color: 'white', mt: 1, display: 'block' }}>
                                {userSocieties.length}/10 Societies Joined
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            {/* Enhanced Societies Grid Section */}
            <Container maxWidth="lg" sx={{ mt: -10, position: 'relative', zIndex: 1 }}>
                <Card elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
                    <CardHeader   
                       title={
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Groups2Icon  color="primary" />
                                <Typography variant="h6">My Societies</Typography>
                                <Chip   size="small" label={`${userSocieties.length} Active`} color="primary"  sx={{ ml: 2 }} />
                            </Stack>  }
                        sx={{ background: 'linear-gradient(to right, #f5f5f5, white)' }} />
                    <Divider />
                    <CardContent sx={{ p: 3 }}>
                        {userSocieties.length === 0 ? (
                            <Box textAlign="center" py={6}>
                                <Groups2Icon  sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No Societies Joined Yet
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Join societies to collect badges and showcase your involvement
                                </Typography>
                            </Box>
                        ) : (
                            <MuiGrid container spacing={3}>
                                {userSocieties.map((society, index) => (
                                    <MuiGrid item xs={12} sm={6} md={4} key={index}>
                                        <Card elevation={2} sx={{  borderRadius: 3, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)',boxShadow: '0 8px 24px rgba(0,0,0,0.1)'  }  }} >
                                            <Box sx={{ p: 3, background: `linear-gradient(45deg, ${getRandomPastelColor()}, ${getRandomPastelColor()})`, display: 'flex',alignItems: 'center',   gap: 2 }} >
                                                <Avatar sx={{ bgcolor: 'white',color: 'primary.main', width: 56,height: 56}} />
                                                   
                                                
                                                <Box>
                                                    <Typography variant="h6" gutterBottom>
                                                        {society.societyName}
                                                    </Typography>
                                                    <Typography   variant="body2"sx={{  color: 'text.secondary',   bgcolor: 'rgba(255,255,255,0.8)', px: 1,py: 0.5, borderRadius: 1,  display: 'inline-block'  }}  >
                                                        {society.positionTitle}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Card>
                                    </MuiGrid>
                                ))}
                            </MuiGrid>
                        )}
                    </CardContent>
                </Card>

                <ApplicationTracker
                    societies={societies}
                    selectedTab={selectedTab}
                    handleTabChange={handleTabChange}
                    selectedSociety={selectedSociety}
                    handleFormSelect={handleFormSelect}
                    selectedForm={selectedForm}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                />
            </Container>
        </Box>
    );
}

export default User;