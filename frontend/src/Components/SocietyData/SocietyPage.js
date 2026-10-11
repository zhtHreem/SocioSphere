import React, { useState, useEffect, useMemo } from 'react';
import { Box, InputBase, Skeleton, Button } from '@mui/material';
import { Search, ArrowOutward, Close, Place, Groups } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSocieties } from '../../lib/api';
import { CardGridSkeleton } from '../common/Skeletons';
import { PageHero, TiltCard } from '../Home/ui';

const ACCENTS = ['#3D5AFE', '#FF3D8B', '#19E3B1', '#8B5CF6', '#38BDF8'];
const display = '"Bricolage Grotesque", sans-serif';

const Logo = ({ society, size = 64 }) => (
  <Box sx={{ width: size, height: size, borderRadius: `${size * 0.26}px`, overflow: 'hidden', background: '#fff', p: '3px', boxShadow: '0 12px 24px -10px rgba(14,16,48,.55)', flexShrink: 0 }}>
    {society.logo ? (
      <Box component="img" src={society.logo} alt={`${society.name} logo`} loading="lazy" sx={{ width: '100%', height: '100%', display: 'block', borderRadius: `${size * 0.22}px` }} />
    ) : (
      <Box sx={{ width: '100%', height: '100%', borderRadius: `${size * 0.22}px`, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: display, fontWeight: 800, fontSize: size * 0.42, background: 'linear-gradient(135deg,#3D5AFE,#FF3D8B)' }}>{(society.name || '?')[0]}</Box>
    )}
  </Box>
);

const SocietyCard = React.memo(({ society, index, onClick }) => {
  const color = ACCENTS[index % ACCENTS.length];
  return (
    <Box component={motion.div} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} sx={{ height: '100%' }}>
      <TiltCard onClick={onClick} max={6} sx={{ borderRadius: 7, overflow: 'hidden', background: '#fff', border: '1px solid rgba(14,16,48,.07)', boxShadow: `0 26px 44px -32px ${color}`, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative', height: 170, background: color }}>
          <Box component="img" src={society.cover || society.image} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(14,16,48,.55))' }} />
          {society.category && <Box sx={{ position: 'absolute', top: 14, right: 14, px: 1.4, py: 0.5, borderRadius: 999, background: '#fff', color: 'var(--ink)', fontWeight: 800, fontSize: 12 }}>{society.category}</Box>}
        </Box>
        <Box sx={{ px: 3, pb: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Box sx={{ mt: '-32px', mb: 1.5, position: 'relative', zIndex: 2 }}><Logo society={society} /></Box>
          <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 23, lineHeight: 1.12, mb: 0.8 }}>{society.name}</Box>
          <Box sx={{ color: 'text.secondary', lineHeight: 1.5, fontSize: 15, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 2 }}>{society.tagline || society.description}</Box>
          <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1.8, color: 'text.secondary', fontSize: 13.5, fontWeight: 700 }}>
            {society.city && <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4 }}><Place sx={{ fontSize: 16 }} />{society.city}</Box>}
            {society.memberCount > 0 && <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4 }}><Groups sx={{ fontSize: 16 }} />{society.memberCount}</Box>}
            <Box sx={{ ml: 'auto', display: 'inline-flex', alignItems: 'center', gap: 0.4, color, fontWeight: 800 }}>View <ArrowOutward sx={{ fontSize: 18 }} /></Box>
          </Box>
        </Box>
      </TiltCard>
    </Box>
  );
});

const SocietyPage = () => {
  const { data: societies = [], isLoading: loading, isError: failed } = useSocieties();
  const [params, setParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(params.get('q') || '');
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  const categories = useMemo(() => ['All', ...Array.from(new Set(societies.map((s) => s.category).filter(Boolean))).sort()], [societies]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return societies.filter((s) => {
      if (category !== 'All' && s.category !== category) return false;
      if (!term) return true;
      return [s.name, s.description, s.tagline, s.category, s.city, ...(s.tags || [])].some((v) => (v || '').toLowerCase().includes(term));
    });
  }, [societies, searchTerm, category]);

  const updateSearch = (v) => {
    setSearchTerm(v);
    setParams(v ? { q: v } : {}, { replace: true });
  };

  return (
    <Box>
      <PageHero eyebrow={`${societies.length || 'All'} communities`} title={<>Pick your <span className="grad-text-light">people</span></>} sub="Search by interest, name or city. Everything is open to browse, no account needed.">
        <Box sx={{ mt: 4.5, mx: 'auto', maxWidth: 620, display: 'flex', alignItems: 'center', gap: 1.5, pl: 2.5, pr: 1, py: 0.8, borderRadius: 999, background: '#fff', color: 'var(--ink)', boxShadow: '0 24px 50px -18px rgba(0,0,0,.55)', transition: 'box-shadow .2s', '&:focus-within': { boxShadow: '0 0 0 4px rgba(25,227,177,.55), 0 24px 50px -18px rgba(0,0,0,.55)' } }}>
          <Search sx={{ color: 'var(--blue)' }} />
          <InputBase fullWidth placeholder="Try 'music', 'Berlin', 'volunteering'..." value={searchTerm} onChange={(e) => updateSearch(e.target.value)} inputProps={{ 'aria-label': 'Search societies' }} sx={{ fontSize: 18, fontWeight: 600, py: 0.8 }} />
          {searchTerm && <Button onClick={() => updateSearch('')} sx={{ minWidth: 0, p: 1, borderRadius: '50%', color: 'text.secondary' }} aria-label="Clear"><Close /></Button>}
        </Box>
      </PageHero>

      <Box sx={{ maxWidth: 1180, mx: 'auto', px: 3, mt: { xs: 5, md: 7 }, minHeight: '50vh' }}>
        {!loading && categories.length > 2 && (
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 3, '&::-webkit-scrollbar': { display: 'none' } }}>
            {categories.map((c) => (
              <Box key={c} component="button" onClick={() => setCategory(c)} sx={{ border: 0, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, px: 2, py: 1, borderRadius: 999, fontWeight: 800, fontSize: 14.5, background: category === c ? 'var(--ink)' : '#fff', color: category === c ? '#fff' : 'var(--ink)', boxShadow: category === c ? 'none' : 'inset 0 0 0 1.5px rgba(14,16,48,.12)', transition: 'all .2s', '&:hover': { background: category === c ? 'var(--ink)' : 'rgba(14,16,48,.06)' } }}>{c}</Box>
            ))}
          </Box>
        )}
        {!loading && !failed && (
          <Box sx={{ mb: 3, fontWeight: 700, color: 'text.secondary' }}>
            {filtered.length} {filtered.length === 1 ? 'community' : 'communities'}{searchTerm && <> matching "<Box component="span" sx={{ color: 'var(--ink)' }}>{searchTerm}</Box>"</>}
          </Box>
        )}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {loading && <Box sx={{ gridColumn: '1 / -1' }}><CardGridSkeleton count={6} height={400} /></Box>}
          <AnimatePresence mode="popLayout">
            {!loading && filtered.map((society, i) => (
              <SocietyCard key={society._id} society={society} index={i} onClick={() => navigate(`/society/${society._id}`)} />
            ))}
          </AnimatePresence>
        </Box>

        {!loading && !filtered.length && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 32, mb: 1 }}>{failed ? "Can't reach the server" : 'No society found'}</Box>
            <Box sx={{ color: 'text.secondary' }}>{failed ? 'Check your connection and refresh.' : 'Try a different word, or clear the filters.'}</Box>
            {!failed && <Button sx={{ mt: 2 }} onClick={() => { updateSearch(''); setCategory('All'); }}>Clear filters</Button>}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SocietyPage;
