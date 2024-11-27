import React, { useState } from "react";
import { Box, TextField, Stack, Paper, FormControl, Select, MenuItem, Checkbox, FormControlLabel, Button, RadioGroup, Radio, Typography } from "@mui/material";

export default function ApplyForm() {
    const [formTitle] = useState("Society Application Form");
    const [formDescription] = useState("Please complete all sections of the application");
    const [questions] = useState([
        {
            id: 1,
            title: "What is your favorite color?",
            type: "Multiple choice",
            options: ["Red", "Blue", "Green", "Yellow"]
        },
        {
            id: 2,
            title: "Select your interests",
            type: "Checkbox",
            options: ["Reading", "Sports", "Music", "Travel"]
        },
        {
            id: 3,
            title: "Tell us about yourself",
            type: "Paragraph"
        }
    ]);
    const [formResponses, setFormResponses] = useState({});

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
        const currentResponse = formResponses[question.id];
        switch (question.type) {
            case "Checkbox": return (
                <FormControl component="fieldset">
                    {question.options.map((option, index) => (
                        <FormControlLabel key={index} control={
                            <Checkbox 
                                checked={(currentResponse || []).includes(option)}
                                onChange={() => handleResponseChange(question.id, option, "Checkbox")}
                            />
                        } label={option} />
                    ))}
                </FormControl>
            );
            
            case "Multiple choice": return (
                <FormControl component="fieldset">
                    <RadioGroup value={currentResponse || ''} onChange={(e) => handleResponseChange(question.id, e.target.value, "Multiple choice")}>
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
                <TextField fullWidth value={currentResponse || ''} onChange={(e) => handleResponseChange(question.id, e.target.value, "Short answer")} variant="outlined" />
            );
            
            case "Paragraph": return (
                <TextField fullWidth multiline rows={4} value={currentResponse || ''} onChange={(e) => handleResponseChange(question.id, e.target.value, "Paragraph")} variant="outlined" />
            );
            
            default: return null;
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <Paper elevation={3} sx={{ width: "100%", maxWidth: 600, p: 4 }}>
                <Typography variant="h4" gutterBottom>{formTitle}</Typography>
                <Typography variant="subtitle1" gutterBottom>{formDescription}</Typography>
                
                <form onSubmit={(e) => { e.preventDefault(); console.log('Form Responses:', formResponses); alert('Form submitted! Check console for responses.'); }}>
                    <Stack spacing={4}>
                        {questions.map((question) => (
                            <Paper key={question.id} variant="outlined" sx={{ p: 3 }}>
                                <Stack spacing={2}>
                                    <Typography variant="h6">{question.title}</Typography>
                                    {renderFormInput(question)}
                                </Stack>
                            </Paper>
                        ))}
                        
                        <Button type="submit" variant="contained" sx={{backgroundColor:"#FF6500"}}>Submit</Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}