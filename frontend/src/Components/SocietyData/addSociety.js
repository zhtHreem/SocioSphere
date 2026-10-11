import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert, Box, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { PageHero, Reveal } from '../Home/ui';

const display = '"Bricolage Grotesque", sans-serif';
const CATEGORIES = ['Music', 'Coding', 'Dance', 'Debate', 'Photography', 'Drama', 'Film', 'Sports', 'Volunteering', 'Robotics', 'Gaming', 'Poetry', 'Other'];
const JOIN = [['apply', 'Apply: people fill in a short form and you review it'], ['request', 'Request: people ask, you approve'], ['open', 'Open: anyone can join']];

// Anyone with an account can start a society. They become its President and can invite leadership from there.
const AddSocietyForm = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const token = localStorage.getItem('token');
  const [form, setForm] = useState({ name: '', tagline: '', category: '', city: '', description: '', cover: '', joinMode: 'apply' });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const uploadCover = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const body = new FormData();
    body.append('image', file);
    try {
      const r = await api.post('/api/uploads', body);
      setForm((f) => ({ ...f, cover: r.data.url }));
    } catch (err) {
      setToast({ open: true, message: err.response?.data?.error || 'Upload failed. Try a JPG or PNG under 4 MB.', severity: 'error' });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api.post('/api/societies/add', form);
      qc.invalidateQueries({ queryKey: ['societies'] });
      navigate(`/society/${r.data._id}`);
    } catch (error) {
      setToast({ open: true, message: error.response?.data?.message || 'Could not create the society. Try again.', severity: 'error' });
    } finally { setBusy(false); }
  };

  if (!token) {
    return (
      <Box>
        <PageHero eyebrow="Start a society" title={<>Build a community <span className="grad-text-light">around what you love</span></>} sub="You will need an account first. It takes a minute." />
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button size="large" variant="contained" component={Link} to="/auth?mode=signup&next=/add">Create an account</Button>
          <Box sx={{ mt: 2, color: 'text.secondary' }}>Already have one? <Box component={Link} to="/auth?next=/add" sx={{ color: 'var(--ink)', fontWeight: 800 }}>Log in</Box></Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <PageHero eyebrow="Start a society" title={<>Build a community <span className="grad-text-light">around what you love</span></>} sub="You become its President. You can add leaders, create events and accept members as it grows." />
      <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3, mt: { xs: 5, md: 8 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' }, gap: 5, alignItems: 'start' }}>
        <Reveal>
          <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2.4 }}>
            <TextField label="Society name" name="name" value={form.name} onChange={set} required inputProps={{ maxLength: 80 }} />
            <TextField label="One line that sells it" name="tagline" value={form.tagline} onChange={set} inputProps={{ maxLength: 120 }} helperText="e.g. Build things with people who like building things" />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.4 }}>
              <TextField select label="Category" name="category" value={form.category} onChange={set}>{CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}</TextField>
              <TextField label="City" name="city" value={form.city} onChange={set} inputProps={{ maxLength: 60 }} />
            </Box>
            <TextField label="What is it about?" name="description" value={form.description} onChange={set} required multiline rows={4} inputProps={{ maxLength: 600 }} helperText="Who it is for, what you do, what members get" />
            <TextField select label="How do people join?" name="joinMode" value={form.joinMode} onChange={set}>{JOIN.map(([k, l]) => <MenuItem key={k} value={k}>{l}</MenuItem>)}</TextField>
            <Box>
              <Box sx={{ fontWeight: 800, mb: 1 }}>Cover image</Box>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button component="label" variant="outlined" sx={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}>Upload a photo<input type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={uploadCover} /></Button>
                <TextField size="small" label="or paste an image link" name="cover" value={form.cover} onChange={set} sx={{ flex: 1, minWidth: 200 }} />
              </Box>
            </Box>
            <Button type="submit" variant="contained" size="large" disabled={busy || !form.name || !form.description || !form.cover}>{busy ? 'Creating...' : 'Create society'}</Button>
          </Box>
        </Reveal>

        <Reveal delay={0.1}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 110 } }}>
            <Box sx={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'text.secondary', mb: 1 }}>How it will look</Box>
            <Box sx={{ position: 'relative', height: 300, borderRadius: 6, overflow: 'hidden', background: 'linear-gradient(145deg,#2f5cff,#5c8dff)', color: '#fff' }}>
              {form.cover && <Box component="img" src={form.cover} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(18,20,24,.88))' }} />
              <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: 3 }}>
                {form.category && <Box sx={{ display: 'inline-block', px: 1.3, py: 0.3, mb: 1, borderRadius: 999, background: '#fff', color: 'var(--ink)', fontWeight: 800, fontSize: 12 }}>{form.category}</Box>}
                <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 28, lineHeight: 1.1 }}>{form.name || 'Your society name'}</Box>
                <Box sx={{ mt: 0.6, opacity: 0.9 }}>{form.tagline || 'A line that makes people want to join.'}</Box>
                {form.city && <Box sx={{ mt: 0.8, fontSize: 14, opacity: 0.8 }}>{form.city}</Box>}
              </Box>
            </Box>
          </Box>
        </Reveal>
      </Box>
      <Snackbar open={toast.open} autoHideDuration={5000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AddSocietyForm;
