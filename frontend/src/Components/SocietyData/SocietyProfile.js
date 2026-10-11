import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Box, Button, Accordion, AccordionSummary, AccordionDetails, Dialog, Tabs, Tab, Avatar } from '@mui/material';
import {
  Edit as EditIcon, Add as AddIcon, ExpandMore, Place, Schedule, Groups,
  ArrowOutward, Close,
} from '@mui/icons-material';
import { useSociety, useSocietyEvents, useTeam, useSocieties, useChatPreview, useMyRole } from '../../lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { PageSkeleton } from '../common/Skeletons';
import EventCreationDialog from './EventCreation';
import { PersonAvatar } from '../Chat/chat';
import { Reveal, TiltCard, Aurora, fmtDate, splitEvents } from '../Home/ui';

const ACCENTS = ['#3D5AFE', '#FF3D8B', '#19E3B1', '#8B5CF6', '#38BDF8'];
const display = '"Bricolage Grotesque", sans-serif';
const SECTIONS = [['about', 'About'], ['why', 'Why join'], ['events', 'Events'], ['team', 'Team'], ['gallery', 'Gallery'], ['faq', 'FAQ'], ['community', 'Community']];

const JOIN = {
  open: { label: 'Join this community', steps: ['Create a free account', 'Tap join and say hello in the chat', 'Show up to the next event'] },
  request: { label: 'Request to join', steps: ['Create a free account', 'Send a short request', 'The team replies and welcomes you in'] },
  apply: { label: 'Apply to join', steps: ['Create a free account', 'Fill in a short application', 'Meet the team and get started'] },
};

// Logo, with a gradient initial as fallback for societies that have none yet
const SocietyLogo = ({ society, size = 112 }) => (
  <Box sx={{ width: size, height: size, borderRadius: `${size * 0.26}px`, overflow: 'hidden', background: '#fff', p: `${size * 0.05}px`, boxShadow: '0 20px 40px -14px rgba(0,0,0,.6)', flexShrink: 0 }}>
    {society.logo ? (
      <Box component="img" src={society.logo} alt={`${society.name} logo`} sx={{ width: '100%', height: '100%', display: 'block', borderRadius: `${size * 0.22}px` }} />
    ) : (
      <Box sx={{ width: '100%', height: '100%', borderRadius: `${size * 0.22}px`, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: display, fontWeight: 800, fontSize: size * 0.42, background: 'linear-gradient(135deg,#3D5AFE,#FF3D8B)' }}>{(society.name || '?')[0]}</Box>
    )}
  </Box>
);

const SectionHead = ({ id, eyebrow, children }) => (
  <Box id={id} sx={{ scrollMarginTop: 150, mb: 3 }}>
    <Box sx={{ fontWeight: 800, fontSize: 12.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--pink)', mb: 0.8 }}>{eyebrow}</Box>
    <Box component="h2" sx={{ m: 0, fontFamily: display, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, fontSize: { xs: '2rem', md: '2.8rem' } }}>{children}</Box>
  </Box>
);

const EventCard = ({ event, index, isAdmin, onEdit, past }) => {
  const navigate = useNavigate();
  const color = ACCENTS[index % ACCENTS.length];
  return (
    <TiltCard max={5} onClick={() => navigate(`/event/${event._id}`)} sx={{ borderRadius: 6, overflow: 'hidden', background: '#fff', border: '1px solid rgba(14,16,48,.07)', boxShadow: `0 24px 40px -30px ${color}`, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ position: 'relative', height: 170, background: color }}>
        <Box component="img" src={event.image} alt={event.title} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: past ? 'saturate(.75)' : 'none' }} />
        <Box sx={{ position: 'absolute', top: 12, left: 12, textAlign: 'center', px: 1.5, py: 0.8, borderRadius: 3, background: '#fff', color: 'var(--ink)', lineHeight: 1, boxShadow: '0 10px 20px -8px rgba(0,0,0,.4)' }}>
          <Box sx={{ fontWeight: 800, fontSize: 11, letterSpacing: '.08em', color }}>{fmtDate.monthShort(event.date)}</Box>
          <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 26 }}>{fmtDate.day(event.date)}</Box>
        </Box>
        <Box sx={{ position: 'absolute', top: 12, right: 12, px: 1.3, py: 0.4, borderRadius: 999, background: past ? 'rgba(14,16,48,.8)' : color, color: '#fff', fontWeight: 800, fontSize: 12 }}>
          {past ? 'Past' : event.price || 'Free'}
        </Box>
      </Box>
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 0.8, flexGrow: 1 }}>
        <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 21, lineHeight: 1.15 }}>{event.title}</Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.6, color: 'text.secondary', fontSize: 13.5, fontWeight: 600 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}><Schedule sx={{ fontSize: 16 }} />{fmtDate.time(event.date)}</Box>
          {event.venue && <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}><Place sx={{ fontSize: 16 }} />{event.venue}</Box>}
        </Box>
        <Box sx={{ color: 'text.secondary', lineHeight: 1.55, fontSize: 14.5 }}>{event.description}</Box>
        {event.attendees > 0 && (
          <Box sx={{ mt: 'auto', pt: 1, fontWeight: 800, fontSize: 13.5, color }}>
            {past ? `${event.attendees} people came` : `${event.attendees}+ expected`}
          </Box>
        )}
        {isAdmin && <Button size="small" startIcon={<EditIcon />} onClick={(e) => { e.stopPropagation(); onEdit(event); }} sx={{ alignSelf: 'flex-start' }}>Edit event</Button>}
      </Box>
    </TiltCard>
  );
};

const SocietyProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const qc = useQueryClient();
  const { data: society = null, isError: failed } = useSociety(id);
  const { data: events = [] } = useSocietyEvents(id);
  const { data: team = [] } = useTeam(id);
  const { data: others = [] } = useSocieties();
  const { data: preview = [] } = useChatPreview(id);
  const { data: me } = useMyRole(id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tab, setTab] = useState('upcoming');
  const [active, setActive] = useState('about');
  const [lightbox, setLightbox] = useState(null);
  const token = localStorage.getItem('token');
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const { upcoming, past } = useMemo(() => splitEvents(events), [events]);
  useEffect(() => { if (society && !upcoming.length && past.length) setTab('past'); }, [society, upcoming.length, past.length]);

  // highlight the section currently in view
  useEffect(() => {
    if (!society) return undefined;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-35% 0px -55% 0px' });
    SECTIONS.forEach(([sid]) => { const el = document.getElementById(sid); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [society]);

  const similar = useMemo(() => {
    if (!society) return [];
    const score = (s) => Number(s.category === society.category) * 2 + Number(s.city === society.city);
    return others.filter((s) => s._id !== society._id).sort((a, b) => score(b) - score(a)).slice(0, 3);
  }, [others, society]);

  const isOwner = me?.role === 'owner';
  const isAdmin = isOwner || me?.role === 'leader'; // leadership of THIS society
  const join = JOIN[society?.joinMode] || JOIN.apply;
  const goApply = () => {
    const target = `/society/${id}/apply/${id}`;
    navigate(token ? target : `/auth?next=${encodeURIComponent(target)}`);
  };
  const scrollTo = (sid) => document.getElementById(sid)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const openDialog = (event = null) => { setSelectedEvent(event); setDialogOpen(true); };
  const closeDialog = () => { setSelectedEvent(null); setDialogOpen(false); };

  if (failed) {
    return (
      <Box sx={{ maxWidth: 560, mx: 'auto', textAlign: 'center', py: 14, px: 3 }}>
        <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 38, mb: 1 }}>We can't find that society</Box>
        <Box sx={{ color: 'text.secondary', mb: 3 }}>It may have moved or been removed.</Box>
        <Button variant="contained" component={Link} to="/society">Browse all societies</Button>
      </Box>
    );
  }
  if (!society) return <PageSkeleton />;

  const shown = tab === 'upcoming' ? upcoming : past;
  const facts = [
    society.meets?.day && ['Meets', `${society.meets.day}${society.meets.time ? `, ${society.meets.time}` : ''}`],
    society.meets?.place && ['Where', society.meets.place],
    society.memberCount > 0 && ['Members', String(society.memberCount)],
    society.founded && ['Founded', String(society.founded)],
  ].filter(Boolean);
  const ghost = { color: '#fff', borderColor: 'rgba(255,255,255,.5)', '&:hover': { borderColor: '#fff', background: 'rgba(255,255,255,.08)' } };

  return (
    <Box>
      {/* ---------- hero ---------- */}
      <Box sx={{ position: 'relative', overflow: 'hidden', color: '#fff', background: 'var(--ink)', mt: '-96px', pt: { xs: 15, md: 18 }, pb: { xs: 6, md: 8 }, borderBottomLeftRadius: { xs: 36, md: 64 }, borderBottomRightRadius: { xs: 36, md: 64 } }}>
        {(society.cover || society.image) && <Box component="img" src={society.cover || society.image} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.42 }} />}
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(14,16,48,.55) 0%, rgba(14,16,48,.9) 100%)' }} />
        <Aurora />
        <Box sx={{ position: 'relative', maxWidth: 1180, mx: 'auto', px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 5 }, alignItems: { md: 'flex-end' } }}>
            <SocietyLogo society={society} size={132} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.8 }}>
                {society.category && <Box sx={{ px: 1.5, py: 0.5, borderRadius: 999, background: 'var(--mint)', color: 'var(--ink)', fontWeight: 800, fontSize: 13 }}>{society.category}</Box>}
                {society.city && <Box sx={{ px: 1.5, py: 0.5, borderRadius: 999, background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.25)', fontWeight: 700, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 0.4 }}><Place sx={{ fontSize: 15 }} />{society.city}</Box>}
              </Box>
              <Box component="h1" sx={{ m: 0, fontFamily: display, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.98, fontSize: { xs: '2.6rem', md: '4.6rem' } }}>{society.name}</Box>
              {society.tagline && <Box sx={{ mt: 1.8, fontSize: { xs: 17, md: 21 }, color: 'rgba(255,255,255,.85)', maxWidth: 700, lineHeight: 1.5 }}>{society.tagline}</Box>}
            </Box>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', gap: { xs: 3, md: 5 } }}>
              {[[society.memberCount, 'members'], [upcoming.length, 'upcoming'], [past.length, 'past events']].filter(([n]) => n != null).map(([n, label]) => (
                <Box key={label}>
                  <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: { xs: 28, md: 38 }, lineHeight: 1 }}>{n}</Box>
                  <Box sx={{ fontSize: 13, opacity: 0.75, fontWeight: 600 }}>{label}</Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, ml: { md: 'auto' } }}>
              <Button size="large" variant="contained" endIcon={<ArrowOutward />} onClick={goApply} sx={{ background: 'var(--mint)', color: 'var(--ink)', boxShadow: '0 14px 34px -10px rgba(25,227,177,.7)', '&:hover': { background: '#fff' } }}>{join.label}</Button>
              <Button size="large" variant="outlined" onClick={() => navigate(`/society/${id}/community`)} sx={ghost}>Say hello</Button>
              {isAdmin && <Button size="large" variant="outlined" startIcon={<AddIcon />} onClick={() => openDialog()} sx={ghost}>Create event</Button>}
              {isAdmin && <Button size="large" variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`create/${id}`)} sx={ghost}>Apply form</Button>}
              {isOwner && <Button size="large" variant="outlined" startIcon={<Groups />} onClick={() => navigate(`/society/${id}/team`)} sx={ghost}>Team and ranks</Button>}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ---------- sticky section nav ---------- */}
      <Box sx={{ position: 'sticky', top: { xs: 70, md: 86 }, zIndex: 20, mt: 3, px: 2, pointerEvents: 'none' }}>
        <Box sx={{ pointerEvents: 'auto', width: 'fit-content', maxWidth: '100%', mx: 'auto', display: 'flex', gap: 0.5, p: 0.6, borderRadius: 999, overflowX: 'auto', background: 'rgba(255,255,255,.88)', backdropFilter: 'blur(14px)', border: '1px solid rgba(14,16,48,.08)', boxShadow: '0 12px 30px -16px rgba(14,16,48,.35)', '&::-webkit-scrollbar': { display: 'none' } }}>
          {SECTIONS.map(([sid, label]) => (
            <Box key={sid} component="button" onClick={() => scrollTo(sid)} sx={{ border: 0, cursor: 'pointer', fontFamily: 'inherit', px: 1.8, py: 0.9, borderRadius: 999, fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap', background: active === sid ? 'var(--ink)' : 'transparent', color: active === sid ? '#fff' : 'var(--ink-soft)', transition: 'all .2s', '&:hover': { background: active === sid ? 'var(--ink)' : 'rgba(14,16,48,.07)' } }}>{label}</Box>
          ))}
        </Box>
      </Box>

      {/* ---------- body ---------- */}
      <Box sx={{ maxWidth: 1180, mx: 'auto', px: 3, mt: { xs: 5, md: 7 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1fr) 340px' }, gap: { xs: 5, md: 7 }, alignItems: 'start' }}>
        <Box sx={{ display: 'grid', gap: { xs: 8, md: 11 }, minWidth: 0 }}>
          {/* About */}
          <Box>
            <SectionHead id="about" eyebrow="About">What {society.name} is about</SectionHead>
            {(society.about?.length ? society.about : [society.description]).map((p, i) => (
              <Box key={i} sx={{ fontSize: 18, lineHeight: 1.75, color: i === 0 ? 'var(--ink)' : 'text.secondary', mb: 2 }}>{p}</Box>
            ))}
            {society.audience?.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ fontWeight: 800, mb: 1.2 }}>This is for you if you are...</Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {society.audience.map((a, i) => (
                    <Box key={a} sx={{ px: 1.8, py: 0.9, borderRadius: 999, fontWeight: 700, fontSize: 14.5, background: `${ACCENTS[i % 5]}1A`, color: ACCENTS[i % 5] === '#19E3B1' ? '#0A8F6E' : ACCENTS[i % 5] }}>{a}</Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Why join */}
          {society.perks?.length > 0 && (
            <Box>
              <SectionHead id="why" eyebrow="What you get">Why people join</SectionHead>
              <Box>
                {society.perks.map((p, i) => (
                  <Box key={p.title} sx={{ display: 'grid', gridTemplateColumns: { xs: '52px 1fr', sm: '84px 1fr' }, gap: 2, py: 2.8, borderTop: '1px solid rgba(14,16,48,.14)', ...(i === society.perks.length - 1 && { borderBottom: '1px solid rgba(14,16,48,.14)' }) }}>
                    <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: { xs: 30, sm: 46 }, lineHeight: 1, letterSpacing: '-0.04em', color: ACCENTS[i % 5] === '#19E3B1' ? '#0FBF8F' : ACCENTS[i % 5] }}>{String(i + 1).padStart(2, '0')}</Box>
                    <Box>
                      <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: { xs: 21, sm: 26 }, lineHeight: 1.15, mb: 0.6 }}>{p.title}</Box>
                      <Box sx={{ color: 'text.secondary', fontSize: 17, lineHeight: 1.6, maxWidth: 560 }}>{p.text}</Box>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 5 }}>
                <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 24, mb: 1.5 }}>How to join</Box>
                <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: { xs: 1.5, sm: 4 } }}>
                  {join.steps.map((s, i) => (
                    <Box component="li" key={s} sx={{ borderTop: '3px solid var(--ink)', pt: 1.2 }}>
                      <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 15, color: 'text.secondary' }}>Step {i + 1}</Box>
                      <Box sx={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4 }}>{s}</Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {/* Events */}
          <Box>
            <SectionHead id="events" eyebrow="What's on">Events</SectionHead>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: '1px solid rgba(14,16,48,.1)' }}>
              <Tab value="upcoming" label={`Upcoming (${upcoming.length})`} />
              <Tab value="past" label={`Past (${past.length})`} />
            </Tabs>
            {shown.length ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                {shown.map((e, i) => (
                  <Reveal key={e._id} delay={(i % 2) * 0.06} sx={{ height: '100%' }}>
                    <EventCard event={e} index={i} past={tab === 'past'} isAdmin={isAdmin} onEdit={openDialog} />
                  </Reveal>
                ))}
              </Box>
            ) : (
              <Box sx={{ p: 5, textAlign: 'center', borderRadius: 6, border: '2px dashed rgba(61,90,254,.3)' }}>
                <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 24 }}>{tab === 'upcoming' ? 'Nothing scheduled right now' : 'No past events yet'}</Box>
                <Box sx={{ color: 'text.secondary', mt: 0.6 }}>{tab === 'upcoming' ? 'Join the chat to hear first when the next one is announced.' : 'This society is just getting started.'}</Box>
              </Box>
            )}
          </Box>

          {/* Team */}
          <Box>
            <SectionHead id="team" eyebrow="The people">Who runs it</SectionHead>
            {team.some((t) => t.people.length) ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' }, gap: 2.5 }}>
                {team.flatMap((t) => t.people.map((p) => ({ ...p, title: t.title }))).map((p, i) => (
                  <Box key={p.id} sx={{ textAlign: 'center', p: 3, borderRadius: 6, background: '#fff', border: '1px solid rgba(14,16,48,.07)' }}>
                    <Avatar sx={{ width: 76, height: 76, mx: 'auto', mb: 1.5, fontSize: 28, fontFamily: display, background: `linear-gradient(135deg, ${ACCENTS[i % 5]}, ${ACCENTS[(i + 2) % 5]})` }}>{p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</Avatar>
                    <Box sx={{ fontWeight: 800 }}>{p.name}</Box>
                    <Box sx={{ color: 'text.secondary', fontSize: 14 }}>{p.title}</Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ color: 'text.secondary' }}>The team will be listed here soon.</Box>
            )}
          </Box>

          {/* Gallery */}
          {society.gallery?.length > 0 && (
            <Box>
              <SectionHead id="gallery" eyebrow="In pictures">A look inside</SectionHead>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' }, gridAutoRows: { xs: 150, sm: 190 }, gap: 1.5 }}>
                {society.gallery.map((g, i) => (
                  <Box key={g} onClick={() => setLightbox(g)} sx={{ gridColumn: i === 0 ? { sm: 'span 2' } : undefined, gridRow: i === 0 ? { sm: 'span 2' } : undefined, borderRadius: 5, overflow: 'hidden', cursor: 'zoom-in', '&:hover img': { transform: 'scale(1.06)' } }}>
                    <Box component="img" src={g} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s' }} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* FAQ */}
          {society.faq?.length > 0 && (
            <Box>
              <SectionHead id="faq" eyebrow="Good to know">Questions people ask</SectionHead>
              {society.faq.map((f) => (
                <Accordion key={f.q} disableGutters elevation={0} sx={{ mb: 1.2, borderRadius: '18px !important', border: '1px solid rgba(14,16,48,.08)', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2.5, '& .MuiAccordionSummary-content': { fontWeight: 800 } }}>{f.q}</AccordionSummary>
                  <AccordionDetails sx={{ px: 2.5, pb: 2.5, color: 'text.secondary', lineHeight: 1.65 }}>{f.a}</AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}

          {/* Community */}
          <Box>
            <SectionHead id="community" eyebrow="Inside the community">What members are saying</SectionHead>
            <Box sx={{ borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(14,16,48,.12)', background: '#fff' }}>
              {preview.length === 0 ? (
                <Box sx={{ p: 4, color: 'text.secondary' }}>No messages yet. Be the first to say hello.</Box>
              ) : preview.map((m) => (
                <Box key={m._id} sx={{ display: 'flex', gap: 1.6, px: 2.5, py: 1.8, borderBottom: '1px solid rgba(14,16,48,.07)' }}>
                  <PersonAvatar name={m.sender?.username || 'Member'} size={38} />
                  <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                      <Box sx={{ fontWeight: 800 }}>{m.sender?.username}</Box>
                      <Box sx={{ fontSize: 12, color: 'text.secondary' }}>#{m.channel || 'general'}</Box>
                    </Box>
                    <Box sx={{ lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.message || (m.image ? 'Shared a photo' : 'Sent a sticker')}</Box>
                  </Box>
                </Box>
              ))}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', px: 2.5, py: 2, background: 'var(--ink)', color: '#fff' }}>
                <Box sx={{ lineHeight: 1.4 }}><Box sx={{ fontWeight: 800 }}>Join the conversation</Box><Box sx={{ opacity: 0.7, fontSize: 14 }}>Read along, then say hello.</Box></Box>
                <Button variant="contained" endIcon={<ArrowOutward />} onClick={() => navigate(`/society/${id}/community`)} sx={{ background: 'var(--mint)', color: 'var(--ink)', '&:hover': { background: '#fff' } }}>Open the community</Button>
              </Box>
            </Box>
          </Box>

          {/* Similar */}
          {similar.length > 0 && (
            <Box>
              <SectionHead id="similar" eyebrow="Keep exploring">You might also like</SectionHead>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.5 }}>
                {similar.map((s) => (
                  <Box key={s._id} component={Link} to={`/society/${s._id}`} sx={{ textDecoration: 'none', color: 'inherit', p: 2.5, borderRadius: 6, background: '#fff', border: '1px solid rgba(14,16,48,.07)', display: 'flex', flexDirection: 'column', gap: 1.5, transition: 'transform .25s, box-shadow .25s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 24px 40px -28px rgba(61,90,254,.7)' } }}>
                    <SocietyLogo society={s} size={56} />
                    <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 19, lineHeight: 1.15 }}>{s.name}</Box>
                    <Box sx={{ color: 'text.secondary', fontSize: 14 }}>{[s.category, s.city].filter(Boolean).join(' · ')}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* ---------- sticky sidebar ---------- */}
        <Box sx={{ position: { md: 'sticky' }, top: { md: 150 }, order: { xs: -1, md: 0 } }}>
          <Box sx={{ borderTop: '3px solid var(--ink)', pt: 2.5 }}>
            {upcoming[0] && (
              <Box component={Link} to={`/event/${upcoming[0]._id}`} sx={{ display: 'block', textDecoration: 'none', color: 'inherit', mb: 3, '&:hover .t': { color: 'var(--blue)' } }}>
                <Box sx={{ fontSize: 12, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--pink)', mb: 0.6 }}>Next up</Box>
                <Box className="t" sx={{ fontFamily: display, fontWeight: 800, fontSize: 26, lineHeight: 1.1, transition: 'color .2s' }}>{upcoming[0].title}</Box>
                <Box sx={{ mt: 0.6, fontWeight: 700 }}>{fmtDate.long(upcoming[0].date)}</Box>
                <Box sx={{ color: 'text.secondary' }}>{fmtDate.time(upcoming[0].date)}{upcoming[0].venue ? ` · ${upcoming[0].venue}` : ''}</Box>
              </Box>
            )}

            <Box component="dl" sx={{ m: 0 }}>
              {facts.map(([label, value]) => (
                <Box key={label} sx={{ py: 1.3, borderTop: '1px solid rgba(14,16,48,.12)' }}>
                  <Box component="dt" sx={{ fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'text.secondary' }}>{label}</Box>
                  <Box component="dd" sx={{ m: 0, mt: 0.2, fontWeight: 700, fontSize: 17, lineHeight: 1.35 }}>{value}</Box>
                </Box>
              ))}
            </Box>

            {society.requirements?.length > 0 && (
              <Box sx={{ py: 1.8, borderTop: '1px solid rgba(14,16,48,.12)' }}>
                <Box sx={{ fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'text.secondary', mb: 0.8 }}>To join</Box>
                {society.requirements.map((r) => (
                  <Box key={r} sx={{ display: 'flex', gap: 1, mb: 0.6, lineHeight: 1.4, fontSize: 15.5 }}><Box component="span" sx={{ color: 'var(--pink)', fontWeight: 800 }}>+</Box>{r}</Box>
                ))}
              </Box>
            )}

            <Button fullWidth size="large" variant="contained" onClick={goApply} sx={{ mt: 1 }}>{join.label}</Button>
            {!token && <Box sx={{ mt: 1, textAlign: 'center', fontSize: 13, color: 'text.secondary' }}>You will be asked to log in first.</Box>}

            {(society.socials?.instagram || society.socials?.website || society.socials?.email) && (
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(14,16,48,.12)', display: 'grid', gap: 0.6, fontWeight: 700 }}>
                {society.socials.instagram && <Box component="a" href={`https://instagram.com/${society.socials.instagram}`} target="_blank" rel="noreferrer" sx={{ color: 'var(--ink)', '&:hover': { color: 'var(--pink)' } }}>Instagram @{society.socials.instagram}</Box>}
                {society.socials.website && <Box>{society.socials.website}</Box>}
                {society.socials.email && <Box component="a" href={`mailto:${society.socials.email}`} sx={{ color: 'var(--ink)', '&:hover': { color: 'var(--pink)' } }}>{society.socials.email}</Box>}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog open={Boolean(lightbox)} onClose={() => setLightbox(null)} maxWidth="lg" PaperProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}>
        <Box sx={{ position: 'relative' }}>
          <Box component="img" src={lightbox || ''} alt="" sx={{ maxWidth: '100%', maxHeight: '86vh', display: 'block', borderRadius: 4 }} />
          <Box component="button" onClick={() => setLightbox(null)} aria-label="Close" sx={{ position: 'absolute', top: 10, right: 10, border: 0, width: 38, height: 38, borderRadius: '50%', cursor: 'pointer', background: '#fff' }}><Close /></Box>
        </Box>
      </Dialog>

      <EventCreationDialog
        open={dialogOpen}
        onClose={closeDialog}
        societyId={id}
        eventToEdit={selectedEvent}
        onEventCreated={() => { qc.invalidateQueries({ queryKey: ['society', id, 'events'] }); qc.invalidateQueries({ queryKey: ['events'] }); }}
        onEventUpdated={() => { qc.invalidateQueries({ queryKey: ['society', id, 'events'] }); qc.invalidateQueries({ queryKey: ['events'] }); }}
      />
    </Box>
  );
};

export default SocietyProfile;
