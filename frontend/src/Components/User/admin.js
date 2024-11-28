import React, { useState } from "react";
import { Box,Avatar, Typography, Card, CardContent,Tabs,Tab,IconButton, CardMedia, Tooltip } from    "@mui/material";
import { Navigate } from "react-router-dom";
import Grid from '@mui/material/Grid2';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import PersonIcon from '@mui/icons-material/Person';

import ContactPageIcon from '@mui/icons-material/ContactPage';
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

function Admin(){
    const [user,setUser]=useState({name:"Admin",Joiningdate:"10-12-2024"})
   // const [value, setValue] = React.useState('one');
    const [selectedTab, setSelectedTab] = useState('one');
     const [selectedSociety, setSelectedSociety] = useState(societies[0].name);
     const handleTabChange = (event,newValue) => {
  //  setValue(newValue);
    setSelectedTab(newValue);
    setSelectedSociety(newValue);
  };
    
    return(
        <Box mt={6}>        

           <Grid container direction={"column"} sx={{position:"relative"}}>
                <Grid item   sx={{background: 'linear-gradient(135deg, #001524 10%, #445D48 90%)',display: "flex",flexDirection:"column", height:"40vh",justifyContent:"center",alignItems:"center", zIndex:5,transition: 'height 0.3s ease','&:hover': { height: '50vh'}}}>
                    <Avatar  sx={{ backgroundColor:"#FBA834",width: 150, height: 150  }}>
                        <PersonIcon fontSize="large"/>
                    </Avatar>
                    
                    <Typography variant="h5" color="white">{user.name}</Typography>
                    <Typography variant="body2" color="white">{user.Joiningdate}</Typography>
                  
                 </Grid>
                 <Grid item  padding={10} sx={{backgroundColor:"#F2F2F2",width: '100%',overflow: 'hidden'}}>

          
                    <Box sx={{ width: '100%',marginTop:10,position: 'relative', zIndex: 5 }}>
                    <Typography variant="h3" sx={{textAlign:"center"}}>Application Tracker</Typography>
                        <Tabs value={selectedTab} onChange={handleTabChange}  textColor="secondary" indicatorColor="secondary"  aria-label="secondary tabs example" sx={{position: 'relative', zIndex: 5}}>
                        {societies.map((society, index) => (
                             <Tab key={index} value={society.name} label={society.name} />
                        ))}
                        </Tabs>
                    

                            {societies.filter(society => society.name === selectedSociety).map((society) => { 
                            return (
                            <Grid container p={5} gap={5} sx={{background:"white",border:"2px solid #42032C"}}>
                          
                            {society.applications.map((app, index)=> (
                                <Grid item key={index} xs={6} md={4} sx={{position: 'relative', zIndex: 5}}>
                                    <Card elevation={20}>
                                        <CardMedia sx={{  display: 'flex', justifyContent: 'center',  alignItems: 'center', height: 120,      backgroundColor: "#FBA834",  }}>
                                            <ContactPageIcon fontSize="large" sx={{ color: "#FFFFFF" }} />
                                         </CardMedia> 
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
                
                <Tooltip title="Create New Society" arrow>
                 <IconButton   sx={{position:"fixed",right:20,bottom:10,zIndex: 100,}}><AddCircleIcon sx={{ color: "#6A9C89", fontSize: 60 }}/></IconButton>
                </Tooltip>
            </Grid>
        </Box>
    )
}

export default Admin;