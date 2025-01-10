import React, { useState, useEffect } from "react";
import { Box, TextField, Stack, Paper, Alert, FormControl, AlertTitle, InputLabel, Dialog, Select, MenuItem, Checkbox, FormControlLabel, Button, RadioGroup, Radio, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import axios from "axios";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ApplyForm() {
    const navigate = useNavigate();
    const { societyId } = useParams();
    const [loading, setLoading] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        positions: [],
        questions: []
    });
    const [position, setPosition] = useState("");
    const [formResponses, setFormResponses] = useState({});
    const [showAuthDialog, setShowAuthDialog] = useState(false);

    // Pre-define container heights to prevent layout shift
    const containerStyles = { minHeight: '100vh', width: '100%', maxWidth: 600,  margin: '0 auto', padding: '2rem' };

    const questionContainerStyle = {
        minHeight: '100px' 
    };

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/api/forms/${societyId}`);
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching form:", error);
                setSnackbarMessage('Error loading form');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };

        fetchForm();
    }, [societyId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            setShowAuthDialog(true);
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
            const response = await axios.post(
                `${process.env.REACT_APP_HOST_URL}/api/responses/${societyId}`,
                responsePayload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                }
            );

            if (response.status === 201) {
                setSnackbarMessage('Form submitted successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage(error.response?.data?.message || 'Error submitting form');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleResponseChange = (questionId, value, type) => {
        setFormResponses(prev => ({
            ...prev,
            [questionId]: type === 'Checkbox'
                ? (prev[questionId] || []).includes(value)
                    ? prev[questionId].filter(v => v !== value)
                    : [...(prev[questionId] || []), value]
                : value
        }));
    };

    const renderFormInput = (question) => {
        const currentResponse = formResponses[question._id];
        
        switch (question.type) {
            case "Checkbox":
                return (
                    <FormControl component="fieldset" fullWidth>
                        {question.options.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox  checked={(currentResponse || []).includes(option)}  onChange={() => handleResponseChange(question._id, option, "Checkbox")} />
                                }
                                label={option}  />
                        ))}
                    </FormControl>
                );
            case "Multiple choice":
                return (
                    <FormControl component="fieldset" fullWidth>
                        <RadioGroup  value={currentResponse || ''} onChange={(e) => handleResponseChange(question._id, e.target.value, "Multiple choice")}  >
                            {question.options.map((option, index) => (
                                <FormControlLabel key={index}  value={option}  control={<Radio />}  label={option}   />
                            ))}
                        </RadioGroup>
                    </FormControl>
                );
            case "Drop down":
                return (
                    <FormControl fullWidth>
                        <Select  value={currentResponse || ''}   onChange={(e) => handleResponseChange(question._id, e.target.value, "Drop down")} >
                            {question.options.map((option, index) => (
                                <MenuItem key={index} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            case "Short answer":
                return (
                    <TextField  fullWidth value={currentResponse || ''} onChange={(e) => handleResponseChange(question._id, e.target.value, "Short answer")} variant="outlined"  />
                );
            case "Paragraph":
                return (
                    <TextField   fullWidth multiline    rows={4}  value={currentResponse || ''}  onChange={(e) => handleResponseChange(question._id, e.target.value, "Paragraph")}  variant="outlined" />
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <Box sx={{ ...containerStyles, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={containerStyles}>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} >

                <Alert   onClose={() => setOpenSnackbar(false)}   severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>{formData.title}</Typography>
                <Typography variant="subtitle1" gutterBottom>{formData.description}</Typography>

                <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel>Position</InputLabel>
                    <Select label="Position"   value={position}  onChange={(e) => setPosition(e.target.value)} >
                        {formData.positions.map((pos) => (
                            <MenuItem key={pos._id} value={pos.title}>
                                {pos.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        {formData.questions.map((question) => (
                            <Paper   key={question._id}  variant="outlined"  sx={{ ...questionContainerStyle, p: 3 }} >
                                <Stack spacing={2}>
                                    <Typography variant="h6">{question.title}</Typography>
                                    {renderFormInput(question)}
                                </Stack>
                            </Paper>
                        ))}
                        <Button   type="submit"   variant="contained" sx={{ backgroundColor: "#526E48" }}  >
                            Submit
                        </Button>
                    </Stack>
                </form>
            </Paper>

            <Dialog open={showAuthDialog} onClose={() => setShowAuthDialog(false)}  maxWidth="xs"  fullWidth >
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <AccountCircleIcon sx={{ fontSize: 80, color: '#50727B', mb: 2 }} />
                    <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
                        <AlertTitle>Authentication Required</AlertTitle>
                        Please log in to submit your application
                    </Alert>
                    <Stack spacing={2} direction="row" justifyContent="center">
                        <Button  variant="outlined"  onClick={() => setShowAuthDialog(false)} >
                            Cancel
                        </Button>
                        <Button  variant="contained" onClick={() => navigate('/auth')} sx={{  backgroundColor: '#50727B', '&:hover': { backgroundColor: '#2C021F' }   }}  >
                            Login Now
                        </Button>
                    </Stack>
                </Box>
            </Dialog>
        </Box>
    );
}