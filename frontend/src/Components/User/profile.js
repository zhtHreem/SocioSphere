import React, { useState } from "react";
import { Box,Avatar, Typography, Stack, Card, CardHeader, CardContent,Tabs,Tab } from    "@mui/material";
import Grid from '@mui/material/Grid2';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import PersonIcon from '@mui/icons-material/Person';



const societies = [
  { 
    name: "Softec", 
    position: "Head",
    applications: [
      { user:"Haha",status: "Pending", date: "2024-01-15" },
      { status: "Reviewed", date: "2024-02-01" }
    ]
  },
  { 
    name: "ACM", 
    position: "President",
    applications: [
      { status: "Accepted", date: "2024-03-10" }
    ]
  },
  { 
    name: "IEEE", 
    position: "Vice-President",
    applications: [
      { status: "In Progress", date: "2024-02-20" },
      { status: "Submitted", date: "2024-01-20" }
    ]
  },
  { 
    name: "GDSC", 
    position: "Lead",
    applications: [
      { status: "Submitted", date: "2024-01-05" }
    ]
  },
];


console.log(societies);

function User(){
    const [user,setUser]=useState({name:"Arsalan",Joiningdate:"10-12-2024"})
   // const [value, setValue] = React.useState('one');
    const [selectedTab, setSelectedTab] = useState('one');
     const [selectedSociety, setSelectedSociety] = useState(societies[0].name);
     const handleTabChange = (event,newValue) => {
  //  setValue(newValue);
    setSelectedTab(newValue);
    setSelectedSociety(newValue);
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
        <Box>


           <Grid container direction={"column"} >
                <Grid item sx={{background: 'linear-gradient(135deg, #001524 10%, #445D48 90%)',display: "flex",flexDirection:"column", height:"40vh",justifyContent:"center",alignItems:"center"}}>
                    <Avatar  sx={{ backgroundColor:"#FBA834",width: 150, height: 150  }}>
                        <PersonIcon fontSize="large"/>
                    </Avatar>
                    
                    <Typography variant="h5" color="white">{user.name}</Typography>
                    <Typography variant="body2" color="white">{user.Joiningdate}</Typography>
                  
                 </Grid>
                 <Grid item  padding={5} sx={{backgroundColor:"#76ABAE",width: '100%',overflow: 'hidden'}}>

                     <Box sx={{ }}>  
              
                     <Typography variant="h3" sx={{marginBottom:5}}>My Societies</Typography>
                     <Slider {...settings}> 
                      {societies.map((society,index)=>(
                         <div key={index}>
                                <Card elevation={20} >
                                     <CardHeader>

                                     </CardHeader>
                                     <CardContent>
                                           <Typography gutterBottom variant="h5" component="div">{society.name} </Typography>
                                           <Typography variant="body2" sx={{ color: 'text.secondary' }}>{society.position} </Typography>
      
                                     </CardContent>
                                </Card>
                         </div>
                      ))}       

                    </Slider>
                    </Box>  

                    
                    <Box sx={{ width: '100%',marginTop:10 }}>
                    <Typography variant="h3" sx={{textAlign:"center"}}>Application Tracker</Typography>
                        <Tabs value={selectedTab} onChange={handleTabChange}  textColor="secondary" indicatorColor="secondary"  aria-label="secondary tabs example" >
                        {societies.map((society, index) => (
                             <Tab key={index} value={society.name} label={society.name} />
                        ))}
                        </Tabs>
                    

                            {societies.filter(society => society.name === selectedSociety).map((society) => { 
                            return (
                            <Grid container p={5} gap={5} sx={{background:"white"}}>
                            {society.applications.map((app, index)=> (
                                <Grid item key={index} xs={6} md={4}>
                                    <Card elevation={20}>
                                        <CardHeader />
                                              <CardContent>
                                                  <Typography variant="h6" color="text.secondary">  {app.user} </Typography>
                                                  <Typography variant="body2" color="text.secondary"> Status: {app.status} </Typography>
                                                  <Typography variant="body2" color="text.secondary">  Date: {app.date} </Typography>
                                               </CardContent>
                                        </Card>
                                </Grid>
                           ))}
                            </Grid>
                           ); })   }
                    </Box> 
                   
                 </Grid>


            </Grid>
        </Box>
    )
}

export default User;