import React from 'react';
import { Box, Typography, Tabs, Tab, Grid2, Card, CardMedia, CardContent ,Alert, AlertTitle} from '@mui/material';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import FormDetailsModal from '../Society/displayform';
import { jwtDecode } from 'jwt-decode';

const ApplicationTracker = ({ societies,  selectedTab,  handleTabChange,  selectedSociety,  handleFormSelect,  selectedForm,  isModalOpen,  setIsModalOpen}) => {
 const isAdmin = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      const decoded = jwtDecode(token);
      return decoded.role === 'admin';
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  };
// Check if user is not in any society
  if (societies.length === 0 && !isAdmin()) {
    return (
      <Box sx={{ width: '100%', mt: 10, position: 'relative', zIndex: 5 }}>
        <Alert 
          severity="info" 
          sx={{ 
            mb: 4,
            backgroundColor: 'white',
            border: '1px solid #42032C',
            '& .MuiAlert-icon': {
              color: '#42032C'
            }
          }}
        >
          <AlertTitle>Welcome to Society Portal!</AlertTitle>
          You haven't joined any societies yet. Join a society to start tracking your applications.
        </Alert>
        <Box 
          sx={{ 
            height: '50vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: 'white',
            border: '2px solid #42032C'
          }}
        >
          <Typography variant="h5" color="text.secondary">
            Join your first society to get started!
          </Typography>
        </Box>
      </Box>
    );
  }


    return (
        <Box sx={{ width: '100%', marginTop: 10, position: 'relative', zIndex: 5 }}>
            <Typography variant="h3" sx={{ textAlign: 'center' }}>Application Tracker</Typography>

            {/* Tabs for Societies */}
            <Tabs value={selectedTab} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary"   aria-label="societies tabs" sx={{ position: 'relative', zIndex: 5 }} >
                {societies.map((society) => (
                    <Tab key={society._id} value={society.name} label={society.name} />
                ))}
            </Tabs>

            {/* Applications for Selected Society */}
            {selectedSociety && selectedSociety.forms && (
                <Grid2 container p={5} gap={5} sx={{ background: 'white', border: '2px solid #42032C' }}>
                    {(!selectedSociety.forms || selectedSociety.forms.length === 0) ? (
            <Box   sx={{    width: '100%', height: '30vh',  display: 'flex',   justifyContent: 'center', alignItems: 'center'   }}>
              <Typography variant="h6" color="text.secondary">
                No forms submitted yet for {selectedSociety.name}
              </Typography>
            </Box>
          ) : (selectedSociety.forms.map((form, index) => (
                        <Grid2  item key={index} xs={6} md={4}  onClick={() => handleFormSelect(form)}sx={{ position: 'relative', zIndex: 5 }} >
                            <Card elevation={20}>
                                <CardMedia  sx={{ display: 'flex', justifyContent: 'center',   alignItems: 'center', height: 120, backgroundColor: '#FBA834', }}>
                                    <ContactPageIcon fontSize="large" sx={{ color: '#FFFFFF' }} />
                                </CardMedia>
                                <CardContent>
                                    <Typography variant="h6" color="text.secondary">
                                        {form.userId?.username || 'Unknown User'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Status:{' '}
                                        <span
                                            style={{
                                                color: (() => {
                                                    if (form.status === 'Accepted') return 'green';
                                                    if (form.status === 'Rejected') return 'red';
                                                    if (form.status === 'Under Review' || form.status === 'Submitted') return 'orange';
                                                    return 'inherit'; // Default color
                                                })(),
                                            }}
                                        >
                                            {form.status === 'Submitted' ? 'Under Review' : form.status}
                                        </span>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Date: {new Date(form.submittedAt).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
           ) ))}
          </Grid2> 
            )}

            {/* Form Details Modal */}
            {selectedForm && (
                <FormDetailsModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    formData={selectedForm}
                    societyId={selectedSociety._id}
                    userId={selectedForm.userId}
                    positions={selectedForm.position}
                />
            )}
        </Box>
    );
};

export default ApplicationTracker;
