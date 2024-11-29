import React, { useState,useEffect } from "react";
import { Box,Avatar, Typography, Stack, Card, CardHeader, CardContent,Tabs,Tab, CardMedia } from    "@mui/material";
import Grid from '@mui/material/Grid2';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import FormDetailsModal from "../Society/displayform";
import PersonIcon from '@mui/icons-material/Person';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BackgroundIcons } from "../Authorization/auth";
import ContactPageIcon from '@mui/icons-material/ContactPage';
import axios from "axios";



function User(){
    const [user,setUser]=useState([])
   // const [value, setValue] = React.useState('one');
    const [societies, setSocieties] = useState([]);
    const [userSocieties,setUserSocieties]=useState([]);
    const [selectedTab, setSelectedTab] = useState('one');
     const [selectedSociety, setSelectedSociety] = useState(null);

             // New state for modal
    const [selectedForm, setSelectedForm] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Fetch societies on component mount
    useEffect(() => {
        const fetchSocieties = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/societies/allsocietyresponses');
                
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
        const fetchUser = async () => {
            try {
                const responsed = await axios.get('http://localhost:5000/api/user/allsociety',{headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }}
            );
                
             console.log("Fetched User Data:", responsed.data);
      if (responsed.data) {
        setUser(responsed.data.user); // Update user details
        setUserSocieties(responsed.data.societies)
      }
            } catch (error) {
                console.error("Error fetching societies", error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        console.log("Updated Societies:", societies);
    }, [societies]);
     const handleTabChange = (event,newValue) => {
  //  setValue(newValue);
    const selectedSoc = societies.find(society => society.name === newValue);
    setSelectedTab(newValue);
    setSelectedSociety(selectedSoc);

    
  };
    // New function to handle form selection
    const handleFormSelect = (form) => {
        setSelectedForm(form);
        setIsModalOpen(true);
    };
    
    const settings = {
    dots: true, // Show dots for navigation
    infinite: true, // Infinite scrolling
    speed: 500, // Speed of transition
    slidesToShow: 4, // Number of items to show at once 
    slidesToScroll: 1, // Number of items to scroll at once
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // Show 1 item for smaller screens
        },
      },
    ],
  };
    return(
        <Box mt={6}>
          < BackgroundIcons/>

           <Grid container direction={"column"} >
                <Grid item   sx={{background: 'linear-gradient(135deg, #001524 10%, #445D48 90%)',display: "flex",flexDirection:"column", height:"40vh",justifyContent:"center",alignItems:"center", zIndex:5,transition: 'height 0.3s ease','&:hover': { height: '50vh'}}}>
                    <Avatar  sx={{ backgroundColor:"#FBA834",width: 150, height: 150  }}>
                        <PersonIcon fontSize="large"/>
                    </Avatar>
                    
                    <Typography variant="h5" color="white">{user.name}</Typography>
                    <Typography variant="body2" color="white">{user.Joiningdate}</Typography>
                  
                 </Grid>
                 <Grid item  padding={10} sx={{backgroundColor:"#F2F2F2",width: '100%',overflow: 'hidden'}}>
                         


                                  <Box sx={{ }}>  
                     <Accordion defaultExpanded sx={{position: 'relative', zIndex: 5}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
          
        >
        
          <Typography variant="h6" >My Societies</Typography>
           </AccordionSummary>

                     
                     <AccordionDetails sx={{backgroundColor:"#393646",p:5}}>
                     <Slider {...settings}> 
                      {userSocieties.map((society,index)=>(
                         <div key={index}>
                                <Card elevation={20} >
                                     <CardHeader>

                                     </CardHeader>
                                     <CardContent>
                                           <Typography gutterBottom variant="h5" component="div">{society.societyName} </Typography>
                                           <Typography variant="body2" sx={{ color: 'text.secondary' }}>{society.positionTitle} </Typography>
      
                                     </CardContent>
                                </Card>
                         </div>
                      ))}       

                    </Slider>
                    </AccordionDetails>
                    </Accordion>
                    </Box> 
             

                    
                    <Box sx={{ width: '100%',marginTop:10,position: 'relative', zIndex: 5 }}>
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


            </Grid>
        </Box>
    )
}

export default User;