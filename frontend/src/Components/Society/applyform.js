import React, { useState, useEffect } from "react";
import { Box, TextField, Stack, Paper, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Button, RadioGroup, Radio, Typography } from "@mui/material";
import axios from "axios";

export default function ApplyForm() {
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [position, setPosition] = useState("");
    const [questions, setQuestions] = useState([]);
    const [formResponses, setFormResponses] = useState({});
     const id="6748d84723ece2f1e9dc31e8"      ////form id
    // Fetch form and questions from backend
    useEffect(() => {
        // Make sure you have the correct token for authentication
        const fetchForm = async () => {
            try {

             const token = localStorage.getItem('token');

                if (!token) {
            console.error("No authentication token found");
            // Redirect to login or show error message
            return;
        }
                const response = await axios.get(`http://localhost:5000/api/forms/${id}`, {
                     headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
                });// Replace with your actual API endpoint
              
                const formData = response.data; // Assuming you are getting the form details
                setFormTitle(formData.title);
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
            console.error("No authentication token found");
            return;
        }

        const responsePayload = {
            formId: id,
            position,
            responses: Object.entries(formResponses).map(([questionId, answer]) => ({
                questionId,
                answer,
            })),
        };

        try {
            const response = await axios.post("http://localhost:5000/api/responses", responsePayload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });

            console.log("Form submitted successfully:", response.data);
            alert("Form submitted successfully!");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to submit the form.");
        }
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
            <Paper elevation={3} sx={{ width: "100%", maxWidth: 600, p: 4 }}>
                <Typography variant="h4" gutterBottom>{formTitle}</Typography>
                <Typography variant="subtitle1" gutterBottom>{formDescription}</Typography>
                <FormControl style={{ marginTop: 0, marginBottom: 0 }} fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Position</InputLabel>
                    <Select label="Position" value={position} onChange={(e) => setPosition(e.target.value)}>
                        <MenuItem value="Finance Department">Finance Department</MenuItem>
                        <MenuItem value="Operational Department">Operational Department</MenuItem>
                        <MenuItem value="Marketing Department">Marketing Department</MenuItem>
                        <MenuItem value="HR Department">HR Department</MenuItem>
                        <MenuItem value="IT Department">IT Department</MenuItem>
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
                        
                        <Button type="submit" variant="contained" onClick={handleSubmit} sx={{backgroundColor:"#FF6500"}}>Submit</Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}
