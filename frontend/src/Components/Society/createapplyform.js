import React, { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { Alert,Box, TextField, Stack, Paper, FormControl, Select,  MenuItem, Grid, Checkbox, FormControlLabel, Button, RadioGroup, Radio, IconButton, List, ListItem } from "@mui/material";
import { Delete, DragIndicator, FileCopy, Add } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Snackbar from '@mui/material/Snackbar';
import axios from "axios";
export default function FormBuilder() {
    const { societyId } = useParams();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [formTitle, setFormTitle] = useState("Society Name");
    const [formDescription, setFormDescription] = useState("Form Description");
    const [questions, setQuestions] = useState([]);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
  



       
    const handleCreateForm = async () => {
    try {
        const formData = {
            title: formTitle,
            description: formDescription,
            position:[],
            questions: questions
        };
       // const societyId="67471c5f0207dccfc85f7281" ;
       console.log("lla",societyId)
        const response = await axios.post(`${process.env.REACT_APP_HOST_URL}/api/forms/${societyId}`,formData, {
            
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            
        });

        if (response.status === 201) {
             setSnackbarMessage('Form created successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
           
        }
    } catch (err) {
        console.error(err);
        setSnackbarMessage(err.response?.data?.message || 'Error creating form');
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

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(questions);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setQuestions(items);
    };

    const handleAddQuestion = () => {
        const newQuestion = { id: Date.now(), title: "Untitled Question", type: "Short answer", options: [], newOption: "", required: false };
        setQuestions([...questions, newQuestion]);
    };

    const handleDuplicate = (question) => {
        const duplicatedQuestion = { ...question, id: Date.now(), title: `${question.title} (Copy)` };
        setQuestions([...questions, duplicatedQuestion]);
    };

    const handleAddOption = (questionId) => {
        setQuestions((prevQuestions) => prevQuestions.map(q => 
            q.id === questionId && q.newOption.trim() !== "" 
                ? { ...q, options: [...q.options, q.newOption], newOption: "" } 
                : q
        ));
    };

    const handleRemoveOption = (questionId, optionIndex) => {
        setQuestions(questions.map(q => q.id === questionId 
            ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) } 
            : q
        ));
    };

    const handleRemoveQuestion = (id) => {
        setQuestions(questions.filter(question => question.id !== id));
    };

    const handleQuestionUpdate = (questionId, field, value) => {
        setQuestions(questions.map(q => q.id === questionId ? { ...q, [field]: value } : q));
    };

    const renderDynamicInput = (question) => {
        const commonProps = { variant: "outlined", required: question.required && isPreviewMode };
        switch (question.type) {
            case "Checkbox":
                return (
                    <FormControl component="fieldset">
                        <List>
                            {question.options.map((option, index) => (
                                <ListItem key={index} secondaryAction={!isPreviewMode && (
                                    <IconButton edge="end" onClick={() => handleRemoveOption(question.id, index)}><Delete /></IconButton>
                                )}>
                                    <FormControlLabel control={<Checkbox />} label={option} />
                                </ListItem>
                            ))}
                        </List>
                        {!isPreviewMode && (
                            <Box mt={2}>
                                <TextField label="Add Option" value={question.newOption || ""} onChange={(e) => handleQuestionUpdate(question.id, "newOption", e.target.value)} size="small" />
                                <Button onClick={() => handleAddOption(question.id)} variant="contained" size="small" sx={{ ml: 1 }}>Add</Button>
                            </Box>
                        )}
                    </FormControl>
                );
            case "Multiple choice":
                return (
                    <FormControl component="fieldset">
                        <RadioGroup>
                            <List>
                                {question.options.map((option, index) => (
                                    <ListItem key={index} secondaryAction={!isPreviewMode && (
                                        <IconButton edge="end" onClick={() => handleRemoveOption(question.id, index)}><Delete /></IconButton>
                                    )}>
                                        <FormControlLabel control={<Radio />} label={option} value={option} />
                                    </ListItem>
                                ))}
                            </List>
                        </RadioGroup>
                        {!isPreviewMode && (
                            <Box mt={2}>
                                <TextField label="Add Option" value={question.newOption || ""} onChange={(e) => handleQuestionUpdate(question.id, "newOption", e.target.value)} size="small" />
                                <Button onClick={() => handleAddOption(question.id)} variant="contained" size="small" sx={{ ml: 1 }}>Add</Button>
                            </Box>
                        )}
                    </FormControl>
                );
            case "Drop down":
                return (
                    <FormControl fullWidth>
                        <Select {...commonProps}>
                            {question.options.map((option, index) => (
                                <MenuItem key={index} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                        {!isPreviewMode && (
                            <Box mt={2}>
                                <TextField label="Add Option" value={question.newOption || ""} onChange={(e) => handleQuestionUpdate(question.id, "newOption", e.target.value)} size="small" />
                                <Button onClick={() => handleAddOption(question.id)} variant="contained" size="small" sx={{ ml: 1 }}>Add</Button>
                            </Box>
                        )}
                    </FormControl>
                );
            case "Short answer": return <TextField {...commonProps} label="Short Answer" />;
            case "Paragraph": return <TextField {...commonProps} label="Paragraph" multiline rows={4} />;
            default: return null;
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <Snackbar   open={openSnackbar}   autoHideDuration={6000}  onClose={handleCloseSnackbar}    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  >
                <Alert   onClose={handleCloseSnackbar}  severity={snackbarSeverity}  sx={{ width: '100%' }}    >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Box p={4} sx={{ backgroundColor: "#f0f0f0", width: '100%', mb: 4 }}>
                <Stack px={4} direction="row" justifyContent="space-between" alignItems="center">
                    <TextField value={formTitle} onChange={(e) => setFormTitle(e.target.value)} variant="standard" fullWidth placeholder="Form Title" InputProps={{ readOnly: isPreviewMode }} />
                    <Stack direction="row" spacing={2}>
                        <Button sx={{backgroundColor:"#FF6500"}}  startIcon={<Add />} onClick={handleAddQuestion} variant="contained" disabled={isPreviewMode}>Add Question</Button>
                        <Button sx={{backgroundColor:"#FF6500"}} onClick={() => setIsPreviewMode(!isPreviewMode)} variant="contained">{isPreviewMode ? "Edit Mode" : "Preview Mode"}</Button>
                    </Stack>
                </Stack>
            </Box>

            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Paper elevation={3} sx={{ width: "50%", padding: 3, mb: 2 }}>
                    <TextField value={formDescription} onChange={(e) => setFormDescription(e.target.value)} label="Form Description" variant="standard" fullWidth InputProps={{ readOnly: isPreviewMode }} />
                </Paper>


                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="questions-list">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {questions.map((question, index) => (
                                    <Draggable key={question.id.toString()} draggableId={question.id.toString()} index={index} isDragDisabled={isPreviewMode}>
                                        {(provided) => (
                                            <Paper ref={provided.innerRef} {...provided.draggableProps} elevation={3} sx={{ width: "50%", padding: 3, mb: 2 }}>
                                                <Grid container direction="row" gap={2}>
                                                    {!isPreviewMode && <Grid item {...provided.dragHandleProps}><DragIndicator /></Grid>}
                                                    <Grid item xs>
                                                        <Stack direction="column" spacing={2}>
                                                            <TextField value={question.title} onChange={(e) => handleQuestionUpdate(question.id, "title", e.target.value)} variant="standard" fullWidth InputProps={{ readOnly: isPreviewMode }} />
                                                            {!isPreviewMode && (
                                                                <FormControl fullWidth>
                                                                    <Select value={question.type} label="Question Type" onChange={(e) => handleQuestionUpdate(question.id, "type", e.target.value)}>
                                                                        {["Checkbox", "Multiple choice", "Drop down", "Short answer", "Paragraph"].map(type => (
                                                                            <MenuItem key={type} value={type}>{type}</MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            )}
                                                            {renderDynamicInput(question)}
                                                        </Stack>
                                                    </Grid>
                                                    {!isPreviewMode && (
                                                        <Grid item>
                                                            <Stack direction="row" spacing={1}>
                                                                <IconButton onClick={() => handleDuplicate(question)}><FileCopy /></IconButton>
                                                                <IconButton onClick={() => handleRemoveQuestion(question.id)}><Delete /></IconButton>
                                                            </Stack>
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            </Paper>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                                <Button variant="contained" size="large" onClick={handleCreateForm}sx={{ backgroundColor: "#3A6351", mt: 4, mb: 4, '&:hover': { backgroundColor: "#2C4F3B" } }} >Create</Button>

            </Box>
        </Box>
    );
}