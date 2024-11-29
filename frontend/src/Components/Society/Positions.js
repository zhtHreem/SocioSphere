import React, { useState } from "react";
import { Avatar,Alert, Box, Typography, Chip,Modal,  Button, useMediaQuery ,TextField} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CakeIcon from "@mui/icons-material/Cake";
import VideocamIcon from "@mui/icons-material/Videocam";
import PersonIcon from '@mui/icons-material/Person';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import axios from "axios";
const SocietyPositions = () => {
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

  // State to track which avatars are showing their names
  const [revealedUsers, setRevealedUsers] = useState({});

  const isSmallScreen = useMediaQuery("(max-width:600px)");


  const saveChanges = async () => {
  const societyId = "6748f6ad0d01a40f0ed06d81"; // Replace with the actual society ID

  try {
    // Send PUT request to update positions
    const response = await axios.put(
      `http://localhost:5000/api/societies/${societyId}/positions`,
      {
        positions: levels.map(level => ({
          title: level.label,
          users: level.users.map(user => user._id), // Assuming each user has an _id
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
    //const userLabel = prompt("Enter the name for the new level:");
    
    setLevels((prevLevels) => [
      ...prevLevels,
      { id: prevLevels.length + 1, label: newLabel, users: [],  },
    ]);
     handleClose();
  };
   const deleteLevel = (id) => {
    setLevels(prevLevels => prevLevels.filter(level => level.id !== id));
  };
  
  const toggleUserNameVisibility = (levelId, userName) => {
    setRevealedUsers(prev => ({
      ...prev,
      [`${levelId}-${userName}`]: !prev[`${levelId}-${userName}`]
    }));
  };

  const generatePath = (levels) => {
  if (levels.length === 0) {
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

  const path = generatePath(levels);

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "linear-gradient(to bottom, #E3F2FD, #80D8FF)", padding: 10 }}>
     <Snackbar   open={openSnackbar}   autoHideDuration={6000}  onClose={handleCloseSnackbar}    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  >
                <Alert   onClose={handleCloseSnackbar}  severity={snackbarSeverity}  sx={{ width: '100%' }}    >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
      <Box sx={{ width: "75%", position: "relative", paddingRight: isSmallScreen ? 0 : 2 }}>
        
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, px: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><FavoriteIcon color="error" /><Typography>35</Typography></Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><Typography>68 / 100</Typography></Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><MonetizationOnIcon color="primary" /><Typography>$2.5M</Typography></Box>
        </Box>
        <Button variant="contained" color="primary" sx={{ mb: 2, zIndex: 10 }} onClick={handleOpen}>Add New Level</Button>
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
          {levels.map((level, index) => (
            <Box   key={level.id} sx={{   position: "absolute",  top: `${index * 150}px`,   left: `${Math.sin(index) * (isSmallScreen ? 50 : 150) + 140}px`, display: "flex",   alignItems: "center",  gap: 2   }} >
              <Chip label={level.label} size="small" color="secondary" />
              {index === 0 && <CakeIcon sx={{ color: "purple" }} />}
              {index === 1 && <VideocamIcon sx={{ color: "blue" }} />}
              {index === 2 && <FavoriteIcon sx={{ color: "red" }} />}
                            <Button variant="outlined" color="error" onClick={() => deleteLevel(level.id)} sx={{ mt: 1 }}>Delete Level</Button>

              {/* Display avatars with toggle for username */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {level.users.map((user, userIndex) => (
                  <Box  key={userIndex} sx={{  display: "flex",  flexDirection: "column",  alignItems: "center",     position: "relative"   }} >
                    <Avatar  alt={user.name}  src={<PersonIcon/>} 
                      sx={{  width: 30, height: 30, cursor: "pointer"  }} 
                      onClick={() => toggleUserNameVisibility(level.id, user.name)}
                      onMouseEnter={() => toggleUserNameVisibility(level.id, user.name)}
                      onMouseLeave={() => toggleUserNameVisibility(level.id, user.name)}  />
                    {revealedUsers[`${level.id}-${user.name}`] && (
                      <Typography variant="body2" sx={{    position: "absolute",  top: "-25px",  backgroundColor: "rgba(0,0,0,0.7)",    color: "white",  padding: "2px 5px",  borderRadius: "4px",  fontSize: "0.7rem"  }}   >
                        {user.name}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
         <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={saveChanges}>
           Save Changes
         </Button>
      </Box>
      {!isSmallScreen && (
        <Box sx={{ width: "25%", padding: 2, backgroundColor: "#fff", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Society Name</Typography>
          <Typography variant="body2">1.Level a - 120 people</Typography>
          <Typography variant="body2">2. Level B - 110 people</Typography>
          <Typography variant="body2">3. Level C - 90 people</Typography>
          <Typography variant="body2" sx={{ mt: 4 }}>Stay tuned for updates!</Typography>
        </Box>
      )}
     
    </Box>
  );
};

export default SocietyPositions ;