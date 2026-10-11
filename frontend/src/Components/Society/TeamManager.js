import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Alert, Snackbar, InputBase, Tooltip, IconButton } from '@mui/material';
import { ArrowBack, ArrowUpward, ArrowDownward, PersonRemove, Edit, Check, Close, DeleteOutline } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { api, useLadder, useMyRole, useSociety } from '../../lib/api';
import { PersonAvatar } from '../Chat/chat';
import { ListRowsSkeleton } from '../common/Skeletons';

const display = '"Bricolage Grotesque", sans-serif';

// The President's control room: who holds which rank. Changes are saved the moment you click.
const TeamManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const token = localStorage.getItem('token');
  const { data: society } = useSociety(id);
  const { data: me, isLoading: roleLoading } = useMyRole(id);
  const { data: ladder = [], isLoading } = useLadder(id);
  const [msg, setMsg] = useState({ text: '', severity: 'success' });
  const [newRank, setNewRank] = useState('');
  const [editing, setEditing] = useState(null); // { index, title }
  const isOwner = me?.role === 'owner';
  let myId = null;
  try { myId = token ? jwtDecode(token).id : null; } catch { /* bad token: treated as logged out */ }
  useEffect(() => { if (!token) navigate(`/auth?next=${encodeURIComponent(`/society/${id}/team`)}`); }, [token, id, navigate]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['society', id, 'ladder'] });
    qc.invalidateQueries({ queryKey: ['society', id, 'team'] });
    qc.invalidateQueries({ queryKey: ['society', id, 'me'] });
  };
  const run = async (fn, ok) => {
    try { await fn(); refresh(); setMsg({ text: ok, severity: 'success' }); }
    catch (e) { setMsg({ text: e.response?.data?.message || 'Something went wrong. Try again.', severity: 'error' }); }
  };

  const move = (person, to) => run(() => api.post(`/api/societies/${id}/members/${person.id}/move`, { toRank: to }), `${person.name} is now ${ladder[to]?.title}.`);
  const remove = (person) => { if (window.confirm(`Remove ${person.name} from the society?`)) run(() => api.delete(`/api/societies/${id}/members/${person.id}`), `${person.name} was removed.`); };
  const addRank = () => { if (!newRank.trim()) return; run(() => api.post(`/api/societies/${id}/ranks`, { title: newRank }), 'Rank added.').then(() => setNewRank('')); };
  const saveRank = () => run(() => api.patch(`/api/societies/${id}/ranks/${editing.index}`, { title: editing.title }), 'Rank renamed.').then(() => setEditing(null));
  const deleteRank = (i) => run(() => api.delete(`/api/societies/${id}/ranks/${i}`), 'Rank removed.');

  if (!token) return null;

  return (
    <Box sx={{ maxWidth: 860, mx: 'auto', px: 3, pb: 6 }}>
      <Box component={Link} to={`/society/${id}`} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, color: 'text.secondary', textDecoration: 'none', fontWeight: 700, mb: 2, '&:hover': { color: 'var(--ink)' } }}><ArrowBack sx={{ fontSize: 18 }} />{society?.name || 'Back'}</Box>
      <Box component="h1" sx={{ m: 0, fontFamily: display, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, fontSize: { xs: '2.6rem', md: '4rem' } }}>Team and ranks</Box>
      <Box sx={{ mt: 2, color: 'text.secondary', fontSize: 18, lineHeight: 1.6, maxWidth: 640 }}>
        The top rank is the President and the second is leadership. Leaders can create events and review applications. Only the President can change ranks. Changes apply the moment you click.
      </Box>

      {!roleLoading && me && !isOwner && (
        <Alert severity="info" sx={{ mt: 3 }}>You can see the team, but only the President can change it.</Alert>
      )}
      {!roleLoading && !me?.role && <Alert severity="warning" sx={{ mt: 3 }}>You are not on this society's team.</Alert>}

      <Box sx={{ mt: 5 }}>
        {(isLoading || roleLoading) && <ListRowsSkeleton count={4} />}
        {ladder.map((rank, ri) => (
          <Box key={rank.index} sx={{ py: 3, borderTop: ri === 0 ? '3px solid var(--ink)' : '1px solid rgba(14,16,48,.14)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
              <Box sx={{ fontFamily: display, fontWeight: 800, color: 'text.secondary', fontSize: 15 }}>Rank {ri + 1}</Box>
              {editing?.index === rank.index ? (
                <>
                  <InputBase autoFocus value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && saveRank()} inputProps={{ maxLength: 40, 'aria-label': 'Rank name' }} sx={{ fontFamily: display, fontWeight: 800, fontSize: 26, borderBottom: '2px solid var(--blue)' }} />
                  <IconButton onClick={saveRank} aria-label="Save"><Check /></IconButton>
                  <IconButton onClick={() => setEditing(null)} aria-label="Cancel"><Close /></IconButton>
                </>
              ) : (
                <>
                  <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em' }}>{rank.title}</Box>
                  {isOwner && <Tooltip title="Rename"><IconButton size="small" onClick={() => setEditing({ index: rank.index, title: rank.title })} aria-label="Rename rank"><Edit fontSize="small" /></IconButton></Tooltip>}
                  {isOwner && rank.index > 1 && rank.people.length === 0 && <Tooltip title="Remove this rank"><IconButton size="small" onClick={() => deleteRank(rank.index)} aria-label="Remove rank"><DeleteOutline fontSize="small" /></IconButton></Tooltip>}
                </>
              )}
            </Box>

            {rank.people.length === 0 ? (
              <Box sx={{ color: 'text.secondary', py: 0.5 }}>Nobody yet. {rank.index > 1 ? 'People join here when you accept their application.' : ''}</Box>
            ) : rank.people.map((p) => (
              <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.1 }}>
                <PersonAvatar name={p.name} size={44} />
                <Box sx={{ flex: 1, fontWeight: 700, fontSize: 17 }}>{p.name}{String(p.id) === String(myId) && <Box component="span" sx={{ ml: 1, color: 'text.secondary', fontWeight: 600, fontSize: 14 }}>you</Box>}</Box>
                {isOwner && (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title={ri === 0 ? 'Already at the top' : `Promote to ${ladder[ri - 1]?.title}`}><span><Button size="small" disabled={ri === 0} startIcon={<ArrowUpward />} onClick={() => move(p, ri - 1)} sx={{ color: 'var(--ink)' }}>Promote</Button></span></Tooltip>
                    <Tooltip title={ri === ladder.length - 1 ? 'Already at the bottom' : `Demote to ${ladder[ri + 1]?.title}`}><span><Button size="small" disabled={ri === ladder.length - 1} startIcon={<ArrowDownward />} onClick={() => move(p, ri + 1)} sx={{ color: 'var(--ink)' }}>Demote</Button></span></Tooltip>
                    <Tooltip title="Remove from society"><IconButton size="small" onClick={() => remove(p)} aria-label={`Remove ${p.name}`}><PersonRemove fontSize="small" /></IconButton></Tooltip>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        ))}

        {isOwner && (
          <Box sx={{ pt: 3, borderTop: '1px solid rgba(14,16,48,.14)', display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <InputBase value={newRank} onChange={(e) => setNewRank(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addRank()} placeholder="Add a rank, e.g. Treasurer" inputProps={{ maxLength: 40, 'aria-label': 'New rank name' }} sx={{ px: 2, py: 0.8, borderRadius: 999, border: '1.5px solid rgba(14,16,48,.2)', minWidth: 260, background: '#fff' }} />
            <Button variant="contained" onClick={addRank} disabled={!newRank.trim()}>Add rank</Button>
          </Box>
        )}

        <Box sx={{ mt: 5, p: 3, borderRadius: 5, background: 'var(--ink)', color: '#fff' }}>
          <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 22, mb: 0.6 }}>How people join</Box>
          <Box sx={{ opacity: 0.85, lineHeight: 1.6 }}>Someone applies on your society page. Open <Box component={Link} to="/user" sx={{ color: 'var(--mint)', fontWeight: 800 }}>your profile</Box> to review the application and accept it. They start at the lowest rank, and you can promote them here whenever you like.</Box>
        </Box>
      </Box>

      <Snackbar open={Boolean(msg.text)} autoHideDuration={4000} onClose={() => setMsg({ ...msg, text: '' })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={msg.severity} onClose={() => setMsg({ ...msg, text: '' })}>{msg.text}</Alert>
      </Snackbar>
    </Box>
  );
};

export default TeamManager;
