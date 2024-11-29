import React, { useState, useEffect } from "react";
import { Box, Avatar, Typography, Card, CardContent, Tabs, Tab, IconButton, CardMedia, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid2';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import axios from "axios";
import FormDetailsModal from "../Society/displayform";

function Admin() {
    const [user, setUser] = useState({ name: "Admin", Joiningdate: "10-12-2024" });
    const [societies, setSocieties] = useState([]);
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('');
    const [selectedSociety, setSelectedSociety] = useState(null);
        // New state for modal
    const [selectedForm, setSelectedForm] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Fetch societies on component mount
    useEffect(() => {
        const fetchSocieties = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/societies/allsocietyresponses', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') // Get the token from local storage
        }
      });
                
                if (response.data.length > 0) {
                    console.log("Fetched Societies:", response.data);
                    setSocieties(response.data);
                    
                    // Set default selected society and tab
                    setSelectedTab(response.data[0].name);
                    setSelectedSociety(response.data[0]);
                }
            } catch (error) {
                console.error("Error fetching societies", error);
            }
        };

        fetchSocieties();
    }, []);

    useEffect(() => {
        console.log("Updated Societies:", societies);
    }, [societies]);

    const handleTabChange = (event, newValue) => {
        const selectedSoc = societies.find(society => society.name === newValue);
        setSelectedTab(newValue);
        setSelectedSociety(selectedSoc);
    };

       // New function to handle form selection
    const handleFormSelect = (form) => {
        setSelectedForm(form);
        setIsModalOpen(true);
    };
    
    return (
        <Box mt={6}>        
            <Grid container direction="column" sx={{position:"relative"}}>
                {/* User Profile Section */}
                <Grid item sx={{  background: 'linear-gradient(135deg, #001524 10%, #445D48 90%)', display: "flex", flexDirection:"column",   height:"40vh",  justifyContent:"center",  alignItems:"center",  zIndex:5,    transition: 'height 0.3s ease',  '&:hover': { height: '50vh'} }}>
                    <Avatar sx={{ backgroundColor:"#FBA834", width: 150, height: 150 }}>
                        <PersonIcon fontSize="large"/>
                    </Avatar>
                    
                    <Typography variant="h5" color="white">{user.name}</Typography>
                    <Typography variant="body2" color="white">{user.Joiningdate}</Typography>
                </Grid>

                {/* Societies Applications Section */}
                <Grid item padding={10} sx={{backgroundColor:"#F2F2F2", width: '100%', overflow: 'hidden'}}>
                    <Box sx={{ width: '100%', marginTop:10, position: 'relative', zIndex: 5 }}>
                        <Typography variant="h3" sx={{textAlign:"center"}}>Application Tracker</Typography>
                        
                        {/* Tabs for Societies */}
                        <Tabs    value={selectedTab}    onChange={handleTabChange} textColor="secondary"    indicatorColor="secondary"    aria-label="societies tabs"    sx={{position: 'relative', zIndex: 5}}>
                            {societies.map((society) => (
                                <Tab key={society._id} value={society.name} label={society.name} />
                            ))}
                        </Tabs>

                        {/* Applications for Selected Society */}
                        {selectedSociety && selectedSociety.forms && (
                            <Grid container p={5} gap={5} sx={{background:"white", border:"2px solid #42032C"}}>
                                {selectedSociety.forms.map((form, index) => (
                                    <Grid item key={index} xs={6} md={4}  onClick={() => handleFormSelect(form)} sx={{position: 'relative', zIndex: 5}}>
                                        <Card elevation={20}>
                                            <CardMedia sx={{  display: 'flex',  justifyContent: 'center',   alignItems: 'center',    height: 120,       backgroundColor: "#FBA834",  }}>
                                                <ContactPageIcon fontSize="large" sx={{ color: "#FFFFFF" }} />
                                            </CardMedia> 
                                            <CardContent>
                                                <Typography variant="h6" color="text.secondary">
                                                    {form.userId?.username || 'Unknown User'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Status: {form.status}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Date: {new Date(form.submittedAt).toLocaleDateString()}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                         {/* Form Details Modal */}
                {selectedForm && (
                    <FormDetailsModal
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        formData={selectedForm}
                        societyId={selectedSociety._id}
                        userId={selectedForm.userId}
                        positions={selectedForm.position}
                    />
                )}
                    </Box> 
                </Grid>
                
                {/* Add Society Button */}
                <Tooltip title="Create New Society" arrow>
                    <IconButton 
                        onClick={() => navigate("/add")} 
                        sx={{position:"fixed", right:20, bottom:10, zIndex: 100}}
                    >
                        <AddCircleIcon sx={{ color: "#6A9C89", fontSize: 60 }}/>
                    </IconButton>
                </Tooltip>
            </Grid>
        </Box>
    );
}

export default Admin;