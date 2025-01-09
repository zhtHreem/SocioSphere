import React, { useState,useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  Button, 
  Box,Alert ,
  DialogActions 
} from '@mui/material';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';

const FormDetailsModal = ({ 
  open, 
  onClose, 
  formData, 
  societyId, 
  userId ,
  positions ,
}) => {
  const [status, setStatus] = useState(formData.status);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
    setStatus(formData.status); // Update the status if formData changes
  }, [formData.status]);
  const handleApprove = async () => {
    try {
     const response = await axios.put(
        `https://socio-sphere-api-sooty.vercel.app/api/societies/forms/approve/${formData._id}`,
        {
          societyId,
          userId,
          status: 'Accepted',
          position: positions,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'), // Ensure this is correctly placed
          },
        }
    );

      setStatus('Accepted');
      // Optional: show success message
       if (response.status === 200 || response.status === 201) {
             setSnackbarMessage('User added successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
           
        }
    } catch (err) {
      console.error(err);
        setSnackbarMessage(err.response?.data?.message || 'Error adding using');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      // Optional: show error message
    }       

  };

  const handleDisapprove = async () => {
    try {
     const response = await axios.put(
        `https://socio-sphere-api-sooty.vercel.app/api/forms/disapprove/${formData._id}`,
        {
          societyId,
          userId,
          status: 'Rejected',
          position: positions,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'), // Ensure this is correctly placed
          },
        }
    );


      setStatus('Rejected');
      // Optional: show success message
      console.log('Form disapproved:', response.data);
    } catch (error) {
      console.error('Error disapproving form:', error);
      // Optional: show error message
    }
  };

  const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      
    >
      <DialogTitle>Form Details</DialogTitle>
      <DialogContent>
        {/* User Information */}
        <Box mb={2}>
          <Typography variant="h6">
            Applicant: {formData.userId?.username || 'Unknown User'}
          </Typography>
          <Typography variant="body2">
            Position: {formData.position || 'Unknown position'}
          </Typography>
          <Typography variant="body2">
            Submitted on: {new Date(formData.submittedAt).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Current Status:
           <span
                style={{
                     color: (() => {
                        if (status === "Accepted") return "green";
                        if (status === "Rejected") return "red";
                        if (status === "Under Review" || status === "Submitted") return "orange";
                         return "inherit"; // Default color
                      })(), }}>
                {status === "Submitted" ? "Under Review" : status}
             </span>
          </Typography>
           
        </Box>

        {/* Form Responses */}
        {formData.responses && formData.responses.map((response, index) => (
          <Box key={index} mb={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              {response.questionTitle}
            </Typography>
            <Typography variant="body1">
              {Array.isArray(response.answer) 
                ? response.answer.join(', ') 
                : response.answer}
            </Typography>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleDisapprove} 
          color="error" 
          variant="contained"
          disabled={status === 'Disapproved'}
        >
          Disapprove
        </Button>
        <Button 
          onClick={handleApprove} 
          color="success" 
          variant="contained"
          disabled={status === 'Approved'}
        >
          Approve
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
      <Snackbar   open={openSnackbar}   autoHideDuration={6000}  onClose={handleCloseSnackbar}    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  >
                <Alert   onClose={handleCloseSnackbar}  severity={snackbarSeverity}  sx={{ width: '100%' }}    >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
    </Dialog>
  );
};

export default FormDetailsModal;