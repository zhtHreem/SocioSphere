import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import { Place, Schedule, ArrowOutward, CheckCircle, IosShare, CalendarMonth, ConfirmationNumber } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { api, useEvent, useSocietyEvents, useRsvpState } from '../../lib/api';
import { PageSkeleton } from '../common/Skeletons';
import { fmtDate, Reveal, Aurora } from '../Home/ui';

const display = '"Bricolage Grotesque", sans-serif';

// Times are venue wall-clock, so the .ics uses "floating" local time (no Z)
const icsStamp = (iso, plusHours = 0) => {
  const d = new Date(new Date(iso).getTime() + plusHours * 3600000);
  return d.toISOString().replace(/[-:]/g, '').slice(0, 15);
};
const downloadIcs = (e) => {
  const esc = (s = '') => s.replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SocioSphere//EN', 'BEGIN:VEVENT', `UID:${e._id}@sociosphere`, `DTSTAMP:${icsStamp(new Date().toISOString())}Z`,
    `DTSTART:${icsStamp(e.date)}`, `DTEND:${icsStamp(e.date, 2)}`, `SUMMARY:${esc(e.title)}`, `DESCRIPTION:${esc(e.description)}`, `LOCATION:${esc([e.venue, e.city].filter(Boolean).join(', '))}`, 'END:VEVENT', 'END:VCALENDAR'];
  const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url; a.download = `${e.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`; a.click();
  URL.revokeObjectURL(url);
};

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: event, isError: failed } = useEvent(id);
  const { data: siblings = [] } = useSocietyEvents(event?.society?._id);
  const { data: rsvpState } = useRsvpState(id);
  const [override, setOverride] = useState(null); // what the server said after you tapped the button
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const token = localStorage.getItem('token');
  const going = override?.going ?? rsvpState?.going ?? false;
  const count = override?.rsvpCount ?? event?.rsvpCount ?? 0;
  useEffect(() => { window.scrollTo(0, 0); setOverride(null); }, [id]);

  const isPast = event ? new Date(event.date).getTime() < Date.now() : false;
  const others = useMemo(() => siblings.filter((s) => s._id !== id && new Date(s.date) >= Date.now()).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 2), [siblings, id]);

  const rsvp = async () => {
    if (!token) { navigate(`/auth?next=${encodeURIComponent(`/event/${id}`)}`); return; }
    setBusy(true);
    try {
      const r = await api.post(`/api/events/${id}/rsvp`);
      setOverride(r.data);
      qc.invalidateQueries({ queryKey: ['me', 'going'] });
      setToast(r.data.going ? "You're going! Add it to your calendar so you don't forget." : 'Your spot is released.');
    } catch { setToast('Something went wrong. Please try again.'); } finally { setBusy(false); }
  };

  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setToast('Link copied'); } catch { setToast(window.location.href); }
  };

  if (failed) {
    return (
      <Box sx={{ maxWidth: 560, mx: 'auto', textAlign: 'center', py: 14, px: 3 }}>
        <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 38, mb: 1 }}>We can't find that event</Box>
        <Button variant="contained" component={Link} to="/c">See what's on</Button>
      </Box>
    );
  }
  if (!event) return <PageSkeleton />;

  const soc = event.society;
  const where = [event.venue, event.city].filter(Boolean).join(', ');
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(where)}`;
  const goingTotal = (event.attendees || 0) + count;

  return (
    <Box>
      {/* hero: the photo, big */}
      <Box sx={{ position: 'relative', overflow: 'hidden', color: '#fff', background: 'var(--ink)', mt: '-96px', pt: { xs: 14, md: 17 }, pb: { xs: 5, md: 7 }, borderBottomLeftRadius: { xs: 36, md: 64 }, borderBottomRightRadius: { xs: 36, md: 64 } }}>
        <Box component="img" src={event.image} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,20,24,.5), rgba(18,20,24,.92))' }} />
        <Aurora />
        <Box sx={{ position: 'relative', maxWidth: 1100, mx: 'auto', px: 3 }}>
          {soc && (
            <Box component={Link} to={`/society/${soc._id}`} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.2, mb: 2.5, color: '#fff', textDecoration: 'none', fontWeight: 800, '&:hover': { opacity: 0.85 } }}>
              {soc.logo && <Box component="img" src={soc.logo} alt="" sx={{ width: 34, height: 34, borderRadius: 2.5, background: '#fff', p: '2px' }} />}
              {soc.name}
            </Box>
          )}
          <Box component="h1" sx={{ m: 0, fontFamily: display, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, fontSize: { xs: '2.6rem', md: '4.8rem' }, maxWidth: 900 }}>{event.title}</Box>
          <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 4 }, fontSize: { xs: 16, md: 19 }, fontWeight: 700 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}><CalendarMonth />{fmtDate.long(event.date)}</Box>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}><Schedule />{fmtDate.time(event.date)}</Box>
            {where && <Box component="a" href={mapUrl} target="_blank" rel="noreferrer" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: '#fff', textDecoration: 'underline', textUnderlineOffset: 4 }}><Place />{where}</Box>}
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3, mt: { xs: 5, md: 7 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1fr) 340px' }, gap: { xs: 5, md: 8 }, alignItems: 'start' }}>
        <Box sx={{ display: 'grid', gap: 7, minWidth: 0 }}>
          {isPast && (
            <Box sx={{ p: 2.5, borderRadius: 5, background: 'var(--ink)', color: '#fff', display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <CheckCircle sx={{ color: 'var(--butter)' }} />
              <Box sx={{ fontWeight: 700 }}>This event has ended{event.attendees ? `. ${event.attendees} people came.` : '.'}</Box>
            </Box>
          )}

          <Box>
            <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 30, mb: 1.5 }}>{isPast ? 'What happened' : 'About this event'}</Box>
            <Box sx={{ fontSize: 19, lineHeight: 1.75 }}>{event.description}</Box>
            {soc?.tagline && <Box sx={{ mt: 2, fontSize: 16.5, lineHeight: 1.7, color: 'text.secondary' }}>It's hosted by {soc.name}: {soc.tagline.charAt(0).toLowerCase() + soc.tagline.slice(1)}</Box>}
          </Box>

          {event.agenda?.length > 0 && (
            <Box>
              <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 30, mb: 2 }}>{isPast ? 'How it ran' : 'How it will run'}</Box>
              <Box>
                {event.agenda.map((a, i) => (
                  <Box key={a.text} sx={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 2, py: 1.8, borderTop: '1px solid rgba(18,20,24,.1)', ...(i === event.agenda.length - 1 && { borderBottom: '1px solid rgba(18,20,24,.1)' }) }}>
                    <Box sx={{ fontWeight: 800, color: 'var(--brand)' }}>{a.time}</Box>
                    <Box sx={{ fontSize: 17, fontWeight: 600 }}>{a.text}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {where && (
            <Box>
              <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 30, mb: 1.5 }}>Where</Box>
              <Box sx={{ fontSize: 18, fontWeight: 600 }}>{event.venue}</Box>
              <Box sx={{ color: 'text.secondary', mb: 1.5 }}>{event.city}</Box>
              <Button component="a" href={mapUrl} target="_blank" rel="noreferrer" variant="outlined" endIcon={<ArrowOutward />} sx={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}>Open in Maps</Button>
            </Box>
          )}

          {soc && (
            <Box sx={{ p: 3, borderRadius: 6, border: '1px solid rgba(18,20,24,.1)', display: 'flex', gap: 2.5, alignItems: 'center', flexWrap: 'wrap' }}>
              {soc.logo && <Box component="img" src={soc.logo} alt="" sx={{ width: 72, height: 72, borderRadius: 4 }} />}
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Box sx={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'text.secondary' }}>Hosted by</Box>
                <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 24, lineHeight: 1.1 }}>{soc.name}</Box>
                <Box sx={{ color: 'text.secondary' }}>{soc.tagline}</Box>
              </Box>
              <Button component={Link} to={`/society/${soc._id}`} variant="outlined" sx={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}>See the society</Button>
            </Box>
          )}

          {others.length > 0 && (
            <Box>
              <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 30, mb: 2 }}>Also coming up</Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                {others.map((o) => (
                  <Reveal key={o._id}>
                    <Box component={Link} to={`/event/${o._id}`} sx={{ display: 'block', textDecoration: 'none', color: 'inherit', borderRadius: 5, overflow: 'hidden', border: '1px solid rgba(18,20,24,.1)', '&:hover': { boxShadow: '0 20px 36px -26px rgba(47,92,255,.7)' } }}>
                      <Box component="img" src={o.image} alt="" sx={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                      <Box sx={{ p: 2 }}>
                        <Box sx={{ fontSize: 12.5, fontWeight: 800, color: 'var(--rose)' }}>{fmtDate.medium(o.date)}</Box>
                        <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 19, lineHeight: 1.15 }}>{o.title}</Box>
                      </Box>
                    </Box>
                  </Reveal>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* RSVP */}
        <Box sx={{ position: { md: 'sticky' }, top: { md: 100 }, order: { xs: -1, md: 0 } }}>
          <Box sx={{ p: 3, borderRadius: 6, background: '#fff', border: '1px solid rgba(18,20,24,.1)', boxShadow: '0 30px 60px -40px rgba(18,20,24,.6)' }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 0.5 }}>
              <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 36, lineHeight: 1 }}>{event.price || 'Free'}</Box>
              {!isPast && goingTotal > 0 && <Box sx={{ fontWeight: 700, color: 'text.secondary' }}>{goingTotal} going</Box>}
            </Box>
            <Box sx={{ color: 'text.secondary', mb: 2.5, display: 'flex', alignItems: 'center', gap: 0.8, fontSize: 14.5 }}><ConfirmationNumber sx={{ fontSize: 18 }} />{event.price && event.price !== 'Free' ? 'Pay at the door' : 'No ticket needed'}</Box>

            {isPast ? (
              <Button fullWidth size="large" variant="outlined" component={Link} to={soc ? `/society/${soc._id}` : '/society'} sx={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}>See upcoming events</Button>
            ) : going ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.6, borderRadius: 4, background: 'rgba(15,191,143,.12)', color: '#0A7A5D', fontWeight: 800, mb: 1.5 }}><CheckCircle />You're going</Box>
                <Button fullWidth size="large" variant="contained" startIcon={<CalendarMonth />} onClick={() => downloadIcs(event)}>Add to calendar</Button>
                <Button fullWidth disabled={busy} onClick={rsvp} sx={{ mt: 1, color: 'text.secondary' }}>Can't make it? Release my spot</Button>
              </>
            ) : (
              <>
                <Button fullWidth size="large" variant="contained" disabled={busy} onClick={rsvp}>{token ? "I'm going" : 'Log in to RSVP'}</Button>
                <Button fullWidth startIcon={<CalendarMonth />} onClick={() => downloadIcs(event)} sx={{ mt: 1, color: 'var(--ink)' }}>Add to calendar</Button>
              </>
            )}

            <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid rgba(18,20,24,.08)', display: 'grid', gap: 0.5 }}>
              <Box sx={{ fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'text.secondary' }}>When</Box>
              <Box sx={{ fontWeight: 700 }}>{fmtDate.long(event.date)}</Box>
              <Box sx={{ fontWeight: 700 }}>{fmtDate.time(event.date)}</Box>
              {where && <><Box sx={{ mt: 1.2, fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'text.secondary' }}>Where</Box><Box sx={{ fontWeight: 700 }}>{where}</Box></>}
            </Box>
            <Button fullWidth startIcon={<IosShare />} onClick={share} sx={{ mt: 2, color: 'text.secondary' }}>Copy link</Button>
          </Box>
        </Box>
      </Box>

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </Box>
  );
};

export default EventPage;
