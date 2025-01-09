import React, { useState, useEffect } from "react";
import { Box, TextField, Stack, Paper,Alert, FormControl,AlertTitle, InputLabel,   Dialog,Select, MenuItem, Checkbox, FormControlLabel, Button, RadioGroup, Radio, Typography } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import axios from "axios";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ApplyForm() {

    const navigate = useNavigate();
    const { societyId } = useParams();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [position, setPosition] = useState("");
    const [positionOption, setPositionOption] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [formResponses, setFormResponses] = useState({});
        const [showAuthDialog, setShowAuthDialog] = useState(false);

    // Fetch form and questions from backend
    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(`https://socio-sphere-api-sooty.vercel.app/api/forms/${societyId}`);// Replace with your actual API endpoint
              
                const formData = response.data; // Assuming you are getting the form details
                setFormTitle(formData.title);
                setPositionOption(formData.positions)
                setFormDescription(formData.description);
                setQuestions(formData.questions); // Set questions from the backend
            } catch (error) {
                console.error("Error fetching form:", error);
            }
        };

        fetchForm();
    }, []);


      const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

          if (!token) {
            setShowAuthDialog(true);
            // Redirect to login or show error message
            return;
        }

        const responsePayload = {
            position,
            responses: Object.entries(formResponses).map(([questionId, answer]) => ({
                questionId,
                answer,
            })),
        };

        try {
            const response = await axios.post(`https://socio-sphere-api-sooty.vercel.app/api/responses/${societyId}`, responsePayload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });

             if (response.status === 201) {
             setSnackbarMessage('Form submitted successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
           
        }
        } catch (error) {
             console.error(error);
        setSnackbarMessage(error.response?.data?.message || 'Error submitting form');
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

    const handleResponseChange = (questionId, value, type) => {
    setFormResponses(prev => ({
        ...prev,
        [questionId]: type === 'Checkbox'
            ? (prev[questionId] || []).includes(value)
                ? prev[questionId].filter(v => v !== value) // Remove value if it already exists
                : [...(prev[questionId] || []), value] // Add value if not already present
            : value // Directly set value for other types like "Short answer"
    }));
};
const handleClose = () => {
        setShowAuthDialog(false);
    };
    
    const renderFormInput = (question) => {
    const currentResponse = formResponses[question._id];
    switch (question.type) {
        case "Checkbox": return (
            <FormControl component="fieldset">
                {question.options.map((option, index) => (
                    <FormControlLabel key={index} control={
                        <Checkbox 
                            checked={(currentResponse || []).includes(option)} // Ensure only selected options are checked
                            onChange={() => handleResponseChange(question._id, option, "Checkbox")}
                        />
                    } label={option} />
                ))}
            </FormControl>
        );
            case "Multiple choice": return (
                <FormControl component="fieldset">
                    <RadioGroup value={currentResponse || ''} onChange={(e) => handleResponseChange(question._id, e.target.value, "Multiple choice")}>
                        {question.options.map((option, index) => (
                            <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                        ))}
                    </RadioGroup>
                </FormControl>
            );
            
            case "Drop down": return (
                <FormControl fullWidth>
                    <Select value={currentResponse || ''} onChange={(e) => handleResponseChange(question.id, e.target.value, "Drop down")}>
                        {question.options.map((option, index) => (
                            <MenuItem key={index} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
            
            case "Short answer": return (
            <TextField fullWidth value={currentResponse || ''} onChange={(e) => handleResponseChange(question._id, e.target.value, "Short answer")} variant="outlined" />
        );
        
        case "Paragraph": return (
            <TextField fullWidth multiline rows={4} value={currentResponse || ''} onChange={(e) => handleResponseChange(question._id, e.target.value, "Paragraph")} variant="outlined" />
        );
        
            
            default: return null;
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <Snackbar   open={openSnackbar}   autoHideDuration={6000}  onClose={handleCloseSnackbar}    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  >
                <Alert   onClose={handleCloseSnackbar}  severity={snackbarSeverity}  sx={{ width: '100%' }}    >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Paper elevation={3} sx={{ width: "100%", maxWidth: 600, p: 4 }}>
                <Typography variant="h4" gutterBottom>{formTitle}</Typography>
                <Typography variant="subtitle1" gutterBottom>{formDescription}</Typography>
                <FormControl style={{ marginTop: 0, marginBottom: 0 }} fullWidth sx={{ mb: 2 }}>
                   <InputLabel>Position</InputLabel>
                  <Select label="Position" value={position} onChange={(e) => setPosition(e.target.value)}>
                  {positionOption.map((position, index) => (
                      <MenuItem key={position._id} value={position.title}>
                          {position.title}
                         </MenuItem>
                            ))}
                         </Select>
                </FormControl>

                
                <form onSubmit={(e) => { e.preventDefault(); console.log('Form Responses:', formResponses); alert('Form submitted! Check console for responses.'); }}>
                    <Stack spacing={4}>
                        {questions.map((question) => (
                            <Paper key={question._id} variant="outlined" sx={{ p: 3 }}>
                                <Stack spacing={2}>
                                    <Typography variant="h6">{question.title}</Typography>
                                    {renderFormInput(question)}
                                </Stack>
                            </Paper>
                        ))}
                        
                     <Button type="submit" variant="contained" onClick={handleSubmit} sx={{backgroundColor:"#526E48"}}>Submit</Button>
                    </Stack>
                </form>
            </Paper>

            {/* Authentication Dialog */}
              <Dialog    open={showAuthDialog}  onClose={handleClose} maxWidth="xs"  fullWidth >
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <AccountCircleIcon  sx={{ fontSize: 80,      color: '#50727B',  mb: 2  }}  />
                    
                    <Alert    severity="info" variant="outlined"  sx={{ mb: 3 }}  >
                        <AlertTitle>Authentication Required</AlertTitle>
                        Please log in to submit your application
                    </Alert>

                    <Stack spacing={2} direction="row" justifyContent="center">
                        <Button   variant="outlined"  onClick={handleClose}   >
                            Cancel
                        </Button>
                        <Button     variant="contained"  onClick={() => navigate('/auth')} sx={{ backgroundColor: '#50727B', '&:hover': {      backgroundColor: '#2C021F' }  }}  >
                            Login Now
                        </Button>
                    </Stack>
                </Box>
            </Dialog>
        </Box>
    );
}
