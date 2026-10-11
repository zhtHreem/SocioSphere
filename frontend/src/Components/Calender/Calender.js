import React, { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAllEvents } from '../../lib/api';
import { EventRowsSkeleton } from '../common/Skeletons';
import { Link } from 'react-router-dom';
import { Box, Button, InputBase, Skeleton } from '@mui/material';
import { Search, Close, Place } from '@mui/icons-material';
import { PageHero, Reveal, fmtDate, splitEvents } from '../Home/ui';

const display = '"Bricolage Grotesque", sans-serif';
const TINTS = ['#3D5AFE', '#FF3D8B', '#19E3B1', '#8B5CF6', '#38BDF8'];
const dayKey = (d) => (typeof d === 'string' ? fmtDate.key(d) : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
const monthOf = (d) => new Date(d).toLocaleDateString('en', { month: 'long', year: 'numeric', timeZone: 'UTC' });

const Pill = ({ active, children, ...rest }) => (
  <Box component="button" {...rest} sx={{ border: 0, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, px: 2, py: 0.9, borderRadius: 999, fontWeight: 800, fontSize: 14.5, background: active ? 'var(--ink)' : '#fff', color: active ? '#fff' : 'var(--ink)', boxShadow: active ? 'none' : 'inset 0 0 0 1.5px rgba(14,16,48,.12)', transition: 'all .2s', '&:hover': { background: active ? 'var(--ink)' : 'rgba(14,16,48,.06)' } }}>{children}</Box>
);

// One event as a clean row: date, title, who is hosting, where
export const EventRow = ({ e, index = 0, past }) => {
  const color = TINTS[index % TINTS.length];
  return (
    <Box component={Link} to={`/event/${e._id}`} sx={{ display: 'grid', gridTemplateColumns: { xs: '64px 1fr', sm: '78px 1fr 150px' }, gap: { xs: 1.6, sm: 3 }, alignItems: 'center', p: { xs: 1.6, sm: 2.2 }, textDecoration: 'none', color: 'inherit', borderRadius: 5, background: '#fff', border: '1px solid rgba(14,16,48,.08)', transition: 'transform .2s, box-shadow .2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 22px 36px -28px ${color}` }, '&:hover .title': { color: 'var(--blue)' }, opacity: past ? 0.8 : 1 }}>
      <Box sx={{ textAlign: 'center', lineHeight: 1 }}>
        <Box sx={{ fontWeight: 800, fontSize: 12, letterSpacing: '.08em', color }}>{fmtDate.monthShort(e.date)}</Box>
        <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: { xs: 34, sm: 42 }, letterSpacing: '-0.03em' }}>{fmtDate.day(e.date)}</Box>
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: 'text.secondary', fontSize: 13.5, fontWeight: 700 }}>
          {e.society?.logo && <Box component="img" src={e.society.logo} alt="" sx={{ width: 22, height: 22, borderRadius: 1.5 }} />}
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.society?.name}</Box>
        </Box>
        <Box className="title" sx={{ fontFamily: display, fontWeight: 800, fontSize: { xs: 20, sm: 24 }, lineHeight: 1.15, transition: 'color .2s' }}>{e.title}</Box>
        <Box sx={{ mt: 0.6, color: 'text.secondary', fontSize: 14.5, display: 'flex', flexWrap: 'wrap', gap: 0.5, columnGap: 1.6 }}>
          <span>{fmtDate.time(e.date)}</span>
          {(e.venue || e.city) && <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.3 }}><Place sx={{ fontSize: 15 }} />{[e.venue, e.city].filter(Boolean).join(', ')}</Box>}
          <Box component="span" sx={{ fontWeight: 800, color: e.price && e.price !== 'Free' ? 'var(--ink)' : '#0A8F6E' }}>{e.price || 'Free'}</Box>
        </Box>
      </Box>
      <Box component="img" src={e.image} alt="" loading="lazy" sx={{ display: { xs: 'none', sm: 'block' }, width: 150, height: 92, objectFit: 'cover', borderRadius: 3, filter: past ? 'saturate(.7)' : 'none' }} />
    </Box>
  );
};

const EventsPage = () => {
  const { data: events = [], isLoading: loading } = useAllEvents();
  const [month, setMonth] = useState('all');
  const [view, setView] = useState('list');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [showPast, setShowPast] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const categories = useMemo(() => ['All', ...Array.from(new Set(events.map((e) => e.society?.category || e.category).filter(Boolean))).sort()], [events]);
  const months = useMemo(() => {
    const seen = [];
    splitEvents(events).upcoming.forEach((e) => { const m = monthOf(e.date); if (!seen.includes(m)) seen.push(m); });
    return seen;
  }, [events]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (month !== 'all' && monthOf(e.date) !== month) return false;
      if (category !== 'All' && (e.society?.category || e.category) !== category) return false;
      return !q || [e.title, e.description, e.venue, e.city, e.society?.name].some((v) => (v || '').toLowerCase().includes(q));
    });
  }, [events, query, category, month]);
  const { upcoming, past } = useMemo(() => splitEvents(filtered), [filtered]);

  const byMonth = useMemo(() => {
    const groups = [];
    upcoming.forEach((e) => {
      const m = monthOf(e.date);
      const last = groups[groups.length - 1];
      if (last && last.month === m) last.items.push(e); else groups.push({ month: m, items: [e] });
    });
    return groups;
  }, [upcoming]);

  const byDay = useMemo(() => {
    const map = {};
    filtered.forEach((e) => { (map[fmtDate.key(e.date)] = map[fmtDate.key(e.date)] || []).push(e); });
    return map;
  }, [filtered]);
  const todays = byDay[dayKey(selectedDate)] || [];

  return (
    <Box>
      <PageHero eyebrow="Events" title={<>Find something <span className="grad-text-light">to go to</span></>} sub="Every event from every community, in one place. Open one to see the details and say you're going.">
        <Box sx={{ mt: 4.5, mx: 'auto', maxWidth: 620, display: 'flex', alignItems: 'center', gap: 1.5, pl: 2.5, pr: 1, py: 0.8, borderRadius: 999, background: '#fff', color: 'var(--ink)', boxShadow: '0 24px 50px -18px rgba(0,0,0,.55)', '&:focus-within': { boxShadow: '0 0 0 4px rgba(25,227,177,.55), 0 24px 50px -18px rgba(0,0,0,.55)' } }}>
          <Search sx={{ color: 'var(--blue)' }} />
          <InputBase fullWidth placeholder="Search events, places or communities" value={query} onChange={(e) => setQuery(e.target.value)} inputProps={{ 'aria-label': 'Search events' }} sx={{ fontSize: 18, fontWeight: 600, py: 0.8 }} />
          {query && <Button onClick={() => setQuery('')} sx={{ minWidth: 0, p: 1, borderRadius: '50%', color: 'text.secondary' }} aria-label="Clear"><Close /></Button>}
        </Box>
      </PageHero>

      <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3, mt: { xs: 5, md: 7 }, minHeight: '50vh' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', maxWidth: '100%', '&::-webkit-scrollbar': { display: 'none' } }}>
            {categories.map((c) => <Pill key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Pill>)}
          </Box>
          <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center' }}>
          <Box component="select" aria-label="Month" value={month} onChange={(e) => setMonth(e.target.value)} sx={{ appearance: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 800, fontSize: 14.5, color: 'var(--ink)', pl: 2, pr: 4.5, py: 1.05, borderRadius: 999, border: '1.5px solid rgba(14,16,48,.15)', background: "#fff url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%230E1030' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\") no-repeat right 16px center" }}>
            <option value="all">All months</option>
            {months.map((m) => <option key={m} value={m}>{m}</option>)}
          </Box>
          <Box sx={{ display: 'flex', p: 0.4, borderRadius: 999, background: 'rgba(14,16,48,.07)' }}>
            {[['list', 'List'], ['calendar', 'Calendar']].map(([k, l]) => (
              <Box key={k} component="button" onClick={() => setView(k)} sx={{ border: 0, cursor: 'pointer', fontFamily: 'inherit', px: 2, py: 0.8, borderRadius: 999, fontWeight: 800, background: view === k ? '#fff' : 'transparent', boxShadow: view === k ? '0 4px 10px -4px rgba(14,16,48,.3)' : 'none' }}>{l}</Box>
            ))}
          </Box>
          </Box>
        </Box>

        {loading && <EventRowsSkeleton count={5} />}

        {!loading && view === 'list' && (
          <>
            {byMonth.length === 0 && (
              <Box sx={{ p: 6, textAlign: 'center', borderRadius: 6, border: '2px dashed rgba(61,90,254,.3)' }}>
                <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 26 }}>{events.length ? 'No upcoming events match' : 'No events yet'}</Box>
                <Box sx={{ color: 'text.secondary', mt: 0.6 }}>{events.length ? 'Try another category or clear the search.' : 'Societies will post theirs here.'}</Box>
              </Box>
            )}
            {byMonth.map((g) => (
              <Box key={g.month} sx={{ mb: 4 }}>
                <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 18, color: 'text.secondary', mb: 1.5 }}>{g.month}</Box>
                <Box sx={{ display: 'grid', gap: 1.6 }}>
                  {g.items.map((e, i) => <Reveal key={e._id} y={16}><EventRow e={e} index={i} /></Reveal>)}
                </Box>
              </Box>
            ))}
            {past.length > 0 && (
              <Box sx={{ mt: 6 }}>
                <Box component="button" onClick={() => setShowPast((v) => !v)} sx={{ border: 0, background: 'none', cursor: 'pointer', fontFamily: display, fontWeight: 800, fontSize: 22, p: 0, mb: 2 }}>
                  Past events ({past.length}) <Box component="span" sx={{ color: 'text.secondary' }}>{showPast ? '−' : '+'}</Box>
                </Box>
                {showPast && <Box sx={{ display: 'grid', gap: 1.6 }}>{past.map((e, i) => <EventRow key={e._id} e={e} index={i} past />)}</Box>}
              </Box>
            )}
          </>
        )}

        {!loading && view === 'calendar' && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '400px 1fr' }, gap: 4, alignItems: 'start' }}>
            <Box sx={{
              p: 2, borderRadius: 6, background: '#fff', border: '1px solid rgba(14,16,48,.08)',
              '& .react-calendar': { width: '100%', border: 'none', fontFamily: 'inherit', background: 'transparent' },
              '& .react-calendar__navigation button': { fontFamily: display, fontWeight: 800, fontSize: 18, borderRadius: '14px' },
              '& .react-calendar__navigation button:enabled:hover, & .react-calendar__navigation button:enabled:focus': { background: 'rgba(61,90,254,.1)' },
              '& .react-calendar__month-view__weekdays abbr': { textDecoration: 'none', fontWeight: 800, fontSize: 12, color: 'var(--blue)' },
              '& .react-calendar__tile': { borderRadius: '14px', height: 52, fontWeight: 700 },
              '& .react-calendar__tile:enabled:hover': { background: 'rgba(61,90,254,.12)' },
              '& .react-calendar__tile--now': { background: 'rgba(25,227,177,.25)' },
              '& .react-calendar__tile--active, & .react-calendar__tile--active:enabled:hover': { background: 'var(--ink)', color: '#fff' },
              '& .react-calendar__month-view__days__day--neighboringMonth': { opacity: 0.35 },
            }}>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={({ date, view: v }) => {
                  const n = v === 'month' ? (byDay[dayKey(date)] || []).length : 0;
                  return n ? <Box sx={{ display: 'flex', justifyContent: 'center', gap: '3px', mt: '2px' }}>{Array.from({ length: Math.min(n, 3) }).map((_, i) => <Box key={i} sx={{ width: 6, height: 6, borderRadius: '50%', background: TINTS[i] }} />)}</Box> : null;
                }}
              />
            </Box>
            <Box>
              <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: { xs: 24, md: 30 }, mb: 2 }}>{selectedDate.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</Box>
              {todays.length ? <Box sx={{ display: 'grid', gap: 1.6 }}>{todays.map((e, i) => <EventRow key={e._id} e={e} index={i} />)}</Box> : (
                <Box sx={{ p: 4, borderRadius: 5, border: '2px dashed rgba(61,90,254,.3)', color: 'text.secondary', fontWeight: 600 }}>Nothing on this day. Dots mark days with events.</Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EventsPage;
