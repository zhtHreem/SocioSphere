import React, { useState } from 'react';
import { Box, TextField, Button, Snackbar, Alert } from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { PageHero, Reveal, TiltCard } from './ui';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission to your backend
    setSnackbar({
      open: true,
      message: 'Thank you for your message. We will get back to you soon!',
      severity: 'success'
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <PhoneIcon />,
      title: "Phone",
      details: [
        "+92 (555) 123-4567",
        "+15 (555) 987-6543"
      ]
    },
    {
      icon: <EmailIcon />,
      title: "Email",
      details: [
        "support@sociosphere.com",
        "info@sociosphere.com"
      ]
    },
    {
      icon: <LocationIcon />,
      title: "Location",
      details: [
        "123 Community Street",
      ]
    },
    {
      icon: <ScheduleIcon />,
      title: "Business Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Weekend: 10:00 AM - 4:00 PM"
      ]
    }
  ];

  const colors = ['#2f5cff', '#ff4d5e', '#0FBF8F', '#5c8dff'];

  return (
    <Box>
      <PageHero eyebrow="Contact" title={<>Say <span className="grad-text-light">hello</span></>} sub="Questions, ideas, or want your society on SocioSphere? We read every message." />

      <Box sx={{ maxWidth: 1180, mx: 'auto', px: 3, mt: { xs: 6, md: 9 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.3fr 1fr' }, gap: 4, alignItems: 'start' }}>
        <Reveal>
          <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: 7, background: '#fff', border: '1px solid rgba(18,20,24,.07)', boxShadow: '0 30px 60px -36px rgba(18,20,24,.5)' }}>
            <Box component="h2" sx={{ m: 0, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, fontSize: 34, letterSpacing: '-0.02em' }}>Send us a message</Box>
            <Box sx={{ color: 'text.secondary', mt: 1, mb: 4 }}>Fill in the form and we'll get back to you as soon as we can.</Box>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <TextField fullWidth label="Your name" name="name" value={formData.name} onChange={handleChange} required />
                <TextField fullWidth label="Email address" name="email" type="email" value={formData.email} onChange={handleChange} required />
                <TextField sx={{ gridColumn: { sm: '1 / -1' } }} fullWidth label="Subject" name="subject" value={formData.subject} onChange={handleChange} required />
                <TextField sx={{ gridColumn: { sm: '1 / -1' } }} fullWidth label="Message" name="message" multiline rows={5} value={formData.message} onChange={handleChange} required />
                <Button sx={{ gridColumn: { sm: '1 / -1' } }} type="submit" variant="contained" size="large">Send message</Button>
              </Box>
            </form>
          </Box>
        </Reveal>

        <Box sx={{ display: 'grid', gap: 2.5 }}>
          {contactInfo.map((info, index) => (
            <Reveal key={index} delay={index * 0.08}>
              <TiltCard max={6} sx={{ borderRadius: 6, p: 3, color: '#fff', background: colors[index % colors.length], boxShadow: `0 24px 40px -28px ${colors[index % colors.length]}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.2, '& svg': { fontSize: 28 } }}>
                  {info.icon}
                  <Box sx={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, fontSize: 22 }}>{info.title}</Box>
                </Box>
                {info.details.map((detail, idx) => (
                  <Box key={idx} sx={{ opacity: 0.92, lineHeight: 1.7 }}>{detail}</Box>
                ))}
              </TiltCard>
            </Reveal>
          ))}
        </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;
