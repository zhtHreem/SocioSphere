import React, { useState, useEffect } from "react";
import { Box, Avatar, Typography, Card, CardContent, Tabs, Tab, IconButton, CardMedia, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid2';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import axios from "axios";
import ApplicationTracker from "../SocietyData/ApplicationTracker";
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
                const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/api/societies/allsocietyresponses`, {
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