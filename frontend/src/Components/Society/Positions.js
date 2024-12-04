import React, { useState ,useEffect} from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { Avatar,Alert, Box, Typography, Chip,Modal,  Button, useMediaQuery ,TextField} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CakeIcon from "@mui/icons-material/Cake";
import DiamondIcon from '@mui/icons-material/Diamond';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import VideocamIcon from "@mui/icons-material/Videocam";
import PersonIcon from '@mui/icons-material/Person';
import Snackbar from '@mui/material/Snackbar';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { Star } from "@mui/icons-material";


const SocietyPositions = () => {
    const { societyId } = useParams();
      const [society, setSociety] = useState(null); // For fetching society details
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [open, setOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [levels, setLevels] = useState([
    { id: 1, label: "President", users: [{ name: "Hareem" }, { name: "Ali" }] },
    { id: 2, label: "Senior Exe", users: [{ name: "Fatima" }, { name: "Ahmed" }] },
    { id: 3, label: "Head", users: [{ name: "Sara" }, { name: "Hamza" },{ name: "Hareem" }, { name: "Ali" }] },
    { id: 4, label: "Deputy", users: [{ name: "Zara" }, { name: "Usman" }] },
    { id: 5, label: "Officer", users: [{ name: "Aisha" }, { name: "Bilal" }] },
  ]);

  const token = localStorage.getItem('token');
  const { role } = jwtDecode(token);
    console.log("role",role)

  // State to track which avatars are showing their names
  const [revealedUsers, setRevealedUsers] = useState({});

  const isSmallScreen = useMediaQuery("(max-width:600px)");


  // Fetch society and positions
  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/societies/${societyId}`);
        setSociety(response.data);
        console.log(response.data)
        setLevels(response.data.positions || []);
      } catch (error) {
        setSnackbarMessage("Error fetching society details.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    fetchSociety();
  }, [societyId]);

  const saveChanges = async () => {
 // const societyId = "674987056173a6d6b60435d2"; // Replace with the actual society ID

  try {
    // Send PUT request to update positions
    const response = await axios.put(
      `http://localhost:5000/api/societies/${societyId}/positions`,
      {
        positions: society.positions.map(position => ({
          title: position.title,
           users: position.users ? position.users.map(user => user) : [],// users: position.users.map(user => user), // Assuming each user has an _id
        })),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') // Get the token from local storage
        }
      }
    );
    

     if (response.status === 200) {
             setSnackbarMessage('Posiitons updated successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
           
        }
    
  } catch (error) {
    setSnackbarMessage(error.response?.data?.message || 'Error updating positions:');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
  }
};


  const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNewLabel(""); // Reset input on close
    setOpen(false);
  };
  const addLevel = () => {
 
    setSociety(prevSociety => ({
      ...prevSociety,
      positions: [...prevSociety.positions, { title: newLabel, users: [] }]
    }));
   
    
     handleClose();
  };
   const deleteLevel = (id) => {
    // setLevels(prevLevels => prevLevels.filter(level => level._id !== id));
     setSociety(prevSociety => ({
      ...prevSociety,
      positions: prevSociety.positions.filter(position => position._id !== id)
    }));
  };
  
  const toggleUserNameVisibility = (levelId, userName) => {
    setRevealedUsers(prev => ({
      ...prev,
      [`${levelId}-${userName}`]: !prev[`${levelId}-${userName}`]
    }));
  };

  const generatePath = (levels) => {
  if (!levels || levels.length === 0) {
    return ""; // No path if there are no levels
  }
  const pathData = levels.map((level, index) => {
    const offsetY = index * 150;
    const horizontalVariation = isSmallScreen ? 50 : 150;
    const offsetX = Math.sin(index) * horizontalVariation + 150;
    return { x: offsetX, y: offsetY };
  });

  let pathString = `M ${pathData[0].x} ${pathData[0].y} `;
  for (let i = 1; i < pathData.length; i++) {
    pathString += `C ${pathData[i - 1].x} ${pathData[i - 1].y + 50}, ${pathData[i].x} ${pathData[i].y - 50}, ${pathData[i].x} ${pathData[i].y} `;
  }
  return pathString;
};

if (!society || !society.positions) {
  return <div>Loading...</div>; // Show a loading message or a fallback UI while data is being fetched
}




  const path = generatePath(society.positions || []);

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "linear-gradient(to bottom, #E3F2FD, #80D8FF)", padding: 10,overflow:"scroll" }}>
     <Snackbar   open={openSnackbar}   autoHideDuration={6000}  onClose={handleCloseSnackbar}    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  >
                <Alert   onClose={handleCloseSnackbar}  severity={snackbarSeverity}  sx={{ width: '100%' }}    >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
      <Box sx={{ width: "75%", position: "relative", paddingRight: isSmallScreen ? 0 : 2 }}>
        

        <Typography variant="h4" sx={{ mb: 4 }}>
          {society ? society.name : "Loading..."}
        </Typography>



        
       {role === "admin" && ( <Button variant="contained" color="primary" sx={{ mb: 2, zIndex: 10 }} onClick={handleOpen}>Add New Level</Button>)}
        
         <Modal open={open} onClose={handleClose}>
         <Box   sx={{  position: "absolute", top: "50%", left: "50%",  transform: "translate(-50%, -50%)",  width: 300,  bgcolor: "background.paper",     boxShadow: 24,p: 4,  borderRadius: 2, }} >
          <h2>Add a New Position</h2>
          <TextField label="Level Name"  value={newLabel} onChange={(e) => setNewLabel(e.target.value)} fullWidth  margin="normal"   />
          <Button  variant="contained"color="success"  onClick={addLevel} fullWidth>  Add </Button>
          <Button variant="outlined"  color="secondary"  onClick={handleClose}  fullWidth   sx={{ mt: 2 }} >   Cancel </Button>
        </Box>
      </Modal>
        <svg width="100%" height={levels.length * 150} style={{ position: "absolute", zIndex: 1 }}>
          <path d={path} stroke="#B3E5FC" strokeWidth="10" fill="none" />
        </svg>
        <Box sx={{ position: "relative", width: "100%", zIndex: 2 }}>
          {society?.positions?.map((position, index) => (
            <Box   key={position._id} sx={{   position: "absolute",  top: `${index * 150}px`,   left: `${Math.sin(index) * (isSmallScreen ? 50 : 150) + 140}px`, display: "flex",   alignItems: "center",  gap: 2   }} >
              <Chip label={position.title} size="small" color="secondary" />
              {index === 0 && <DiamondIcon sx={{ color: "purple" }} />}
              {index === 1 && <WorkspacePremiumIcon sx={{ color: "orange" }} />}
              {index === 2 && <Star sx={{ color: "blue" }} />}
              {index === 3 && <StarHalfIcon sx={{ color: "red" }} />}
              
                          {role === "admin" && (  <Button variant="outlined" color="error" onClick={() => deleteLevel(position._id)} sx={{ mt: 1 }}>Delete Level</Button>)}

              {/* Display avatars with toggle for username */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {position.users.map((user, userIndex) => (
                  <Box  key={userIndex} sx={{  display: "flex",  flexDirection: "column",  alignItems: "center",     position: "relative"   }} >
                  <Avatar sx={{  width: 30, height: 30,  cursor: "pointer",  bgcolor: "primary.main",  }}
                      onClick={() => toggleUserNameVisibility(position._id, user)} onMouseEnter={() => toggleUserNameVisibility(position._id, user)} onMouseLeave={() => toggleUserNameVisibility(position._id, user)}>
                      <PersonIcon style={{ color: "white" }} /> {/* Adjust icon color if needed */}
                  </Avatar>

                    {revealedUsers[`${index}-${user }`] && (
                      <Typography variant="body2" sx={{    position: "absolute",  top: "-25px",  backgroundColor: "rgba(0,0,0,0.7)",    color: "white",  padding: "2px 5px",  borderRadius: "4px",  fontSize: "0.7rem"  }}   >
                        {user}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
         {role === "admin" && (<Button variant="contained" color="success" sx={{ mt: 2 }} onClick={saveChanges}>
           Save Changes
         </Button>)}
      </Box>
      {!isSmallScreen && (
        <Box sx={{ width: "25%", padding: 2, backgroundColor: "#fff", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{society.name}</Typography>
          {society.positions.map((position, index) => (
           <Typography key={index} variant="body2">{`${index + 1}. ${position.title} - ${position.users.length} people`}</Typography>
          ))}
          <Typography variant="body2" sx={{ mt: 4 }}>Stay tuned for updates!</Typography>
        </Box>
      )}
     
    </Box>
  );
};

export default SocietyPositions ;