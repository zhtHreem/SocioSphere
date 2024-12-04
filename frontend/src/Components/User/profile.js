import React, { useState,useEffect } from "react";
import { Box,Avatar, Typography, Stack, Card, CardHeader, CardContent,Tabs,Tab, CardMedia } from    "@mui/material";
import Grid from '@mui/material/Grid2';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PersonIcon from '@mui/icons-material/Person';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BackgroundIcons } from "../Authorization/auth";
import axios from "axios";
import ApplicationTracker from "../SocietyData/ApplicationTracker";


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
                const response = await axios.get('http://localhost:5000/api/societies/allsocietyresponses', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') // Get the token from local storage
        }
      });
                

               
                if (response.data.length > 0) {
                    console.log("Fetched Societies:", response.data);
                     const filteredSocieties = response.data.filter(society =>
                    userSocieties.some(userSociety => userSociety.societyName === society.name)
                );
                console.log("Fetched Socieaaaties:", filteredSocieties);
                 //   setSocieties(response.data);
                     setSocieties(filteredSocieties);
                    // Set default selected society and tab
                    setSelectedTab(filteredSocieties[0].name);
                    setSelectedSociety(filteredSocieties[0]);
                }
            } catch (error) {
                console.error("Error fetching societies", error);
            }
        };

        fetchSocieties();
    },  [userSocieties]);


     useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/allsociety',{headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }}
            );
                
             console.log("Fetched User Data:", response.data);
      if (response.data) {
        setUser(response.data.user); // Update user details
        setUserSocieties(response.data.societies)
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
                <AccordionSummary expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"  id="panel3-header"  >
        
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


            </Grid>
        </Box>
    )
}

export default User;