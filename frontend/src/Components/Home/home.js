import React, { Suspense, lazy, useMemo } from 'react';
import { Box, Button, Skeleton } from '@mui/material';
import { ArrowOutward } from '@mui/icons-material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSocieties, useAllEvents } from '../../lib/api';
import { Reveal, TiltCard, Marquee, Magnetic, SectionTitle, Aurora, photo, PHOTOS, fmtDate } from './ui';

const Hero3D = lazy(() => import('./Hero3D'));

const CATEGORIES = [
  ['Music', PHOTOS.music], ['Debate', PHOTOS.debate], ['Robotics', PHOTOS.robotics], ['Dance', PHOTOS.dance], ['Photography', PHOTOS.photography], ['Drama', PHOTOS.drama],
  ['Coding', PHOTOS.code], ['Film', PHOTOS.film], ['Sports', PHOTOS.sports], ['Volunteering', PHOTOS.volunteer], ['Gaming', PHOTOS.gaming], ['Poetry', PHOTOS.poetry],
];

const Hero = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, 70]);
  const sphereY = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', color: '#fff', background: 'var(--ink)', mt: '-96px', display: { xs: 'flex', md: 'block' }, flexDirection: 'column', minHeight: { xs: 'auto', md: 760 }, pt: { xs: 15, md: 17 }, pb: { xs: 8, md: 10 }, borderBottomLeftRadius: { xs: 36, md: 72 }, borderBottomRightRadius: { xs: 36, md: 72 } }}>
      <Aurora />
      <Box component={motion.div} style={{ y: sphereY }} sx={{ position: { xs: 'relative', md: 'absolute' }, inset: { md: 0 }, height: { xs: 380, md: 'auto' }, order: 2, zIndex: 1 }}>
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>
      </Box>
      <Box sx={{ position: 'relative', zIndex: 4, maxWidth: 1180, mx: 'auto', px: 3, display: 'grid', gridTemplateColumns: '1fr', alignItems: 'center', pointerEvents: 'none', '& a, & button': { pointerEvents: 'auto' } }}>
        <Box component={motion.div} style={{ y: textY }} sx={{ position: 'relative', zIndex: 4, maxWidth: { md: 640 } }}>
          <Reveal delay={0.08}>
            <Box component="h1" sx={{ m: 0, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 0.95, fontSize: { xs: '3.6rem', sm: '4.6rem', md: '6.4rem' } }}>
              Your world.<br />
              <Box component="span" className="grad-text-light">Way more</Box><br />
              <Box component="span" sx={{ position: 'relative', display: 'inline-block' }}>
                alive.
              </Box>
            </Box>
          </Reveal>
          <Reveal delay={0.16}>
            <Box component="p" sx={{ mt: 3.5, mb: 0, maxWidth: 480, fontSize: { xs: 17, md: 20 }, lineHeight: 1.6, color: 'rgba(255,255,255,.78)' }}>
              Discover groups and communities, join in a minute, chat with your crew and never miss what's happening around you.
            </Box>
          </Reveal>
          <Reveal delay={0.24}>
            <Box sx={{ mt: 4.5, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Magnetic>
                <Button size="large" variant="contained" endIcon={<ArrowOutward />} onClick={() => navigate('/society')} sx={{ background: 'var(--butter)', color: 'var(--ink)', boxShadow: '0 14px 34px -10px rgba(255,225,77,.7)', '&:hover': { background: '#fff', boxShadow: '0 14px 34px -10px rgba(255,255,255,.6)' } }}>
                  Explore societies
                </Button>
              </Magnetic>
              <Magnetic>
                <Button size="large" variant="outlined" onClick={() => navigate('/events')} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.45)', '&:hover': { borderColor: '#fff', background: 'rgba(255,255,255,.08)' } }}>
                  See what's on
                </Button>
              </Magnetic>
            </Box>
          </Reveal>
        </Box>

      </Box>
    </Box>
  );
};

const CategoryMarquee = () => {
  const navigate = useNavigate();
  return (
  <Box sx={{ pt: 6 }}>
    <Marquee speed={48}>
      {CATEGORIES.map(([name, id]) => (
        <Box key={name} role="link" tabIndex={0} onClick={() => navigate('/society?q=' + encodeURIComponent(name))} onKeyDown={(e) => e.key === 'Enter' && navigate('/society?q=' + encodeURIComponent(name))} sx={{ cursor: 'pointer', position: 'relative', flexShrink: 0, width: { xs: 150, md: 190 }, height: { xs: 104, md: 130 }, borderRadius: 5, overflow: 'hidden', boxShadow: '0 16px 30px -18px rgba(18,20,24,.6)', '&:hover img': { transform: 'scale(1.1)' } }}>
          <Box component="img" src={photo(id, 400, 260)} alt={name} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s ease' }} />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(18,20,24,.85))' }} />
          <Box sx={{ position: 'absolute', left: 14, bottom: 10, color: '#fff', fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, fontSize: { xs: 17, md: 20 } }}>{name}</Box>
        </Box>
      ))}
    </Marquee>
  </Box>
  );
};

/* ---------- What's on (live from the calendar) ---------- */
const ACCENTS = ['#2f5cff', '#e5304a', '#0e9f9a', '#b89800', '#1e88e5'];

const WhatsOn = ({ events, societyCount, loading }) => {
  const navigate = useNavigate();
  const { list, upcoming } = useMemo(() => {
    const now = Date.now() - 86400000;
    const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    const future = sorted.filter((e) => new Date(e.date).getTime() >= now);
    // nothing scheduled? show the most recent ones instead of an empty section
    return future.length ? { list: future.slice(0, 3), upcoming: true } : { list: sorted.slice(-3).reverse(), upcoming: false };
  }, [events]);

  return (
    <Box sx={{ maxWidth: 1180, mx: 'auto', px: 3, mt: { xs: 9, md: 14 } }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, mb: { xs: 4, md: 6 } }}>
        <Box>
          <Box sx={{ fontWeight: 800, fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--rose)', mb: 1 }}>
            {upcoming ? 'Coming up' : 'Recently'}{societyCount ? ` · ${societyCount} societies posting` : ''}
          </Box>
          <Box component="h2" sx={{ m: 0, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1, fontSize: { xs: '2.4rem', md: '3.8rem' } }}>
            What's <span className="grad-text">on</span>
          </Box>
        </Box>
        <Button onClick={() => navigate('/events')} endIcon={<ArrowOutward />} sx={{ fontWeight: 800, color: 'var(--ink)', px: 0, '&:hover': { background: 'transparent', color: 'var(--brand)' } }}>Open the full calendar</Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(' + (loading ? 4 : Math.min(list.length + 1, 4)) + ', 1fr)' }, gap: 3 }}>
        {loading && [0, 1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={400} sx={{ borderRadius: 7 }} />)}
        {!loading && list.map((e, i) => {
          const color = ACCENTS[i % ACCENTS.length];
          return (
            <Reveal key={e._id} delay={i * 0.08}>
              <TiltCard max={7} onClick={() => navigate(`/event/${e._id}`)} sx={{ height: 400, borderRadius: 7, overflow: 'hidden', background: 'var(--ink)', boxShadow: `0 30px 50px -30px ${color}` }}>
                <Box component="img" src={e.image} alt={e.title} loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,20,24,.15) 0%, transparent 35%, rgba(18,20,24,.92) 100%)' }} />
                <Box sx={{ position: 'absolute', top: 16, left: 16, textAlign: 'center', px: 1.7, py: 0.9, borderRadius: 3, background: '#fff', color: 'var(--ink)', lineHeight: 1, boxShadow: '0 12px 24px -10px rgba(0,0,0,.5)' }}>
                  <Box sx={{ fontWeight: 800, fontSize: 11, letterSpacing: '.08em', color }}>{fmtDate.monthShort(e.date)}</Box>
                  <Box sx={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, fontSize: 28 }}>{fmtDate.day(e.date)}</Box>
                </Box>
                <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: 3, color: '#fff' }}>
                  {e.society?.name && <Box sx={{ fontSize: 12, fontWeight: 800, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--butter)', mb: 0.7 }}>{e.society.name}</Box>}
                  <Box sx={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, fontSize: 25, lineHeight: 1.1, mb: 0.8 }}>{e.title}</Box>
                  <Box sx={{ fontSize: 14.5, lineHeight: 1.5, color: 'rgba(255,255,255,.8)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{e.description}</Box>
                </Box>
              </TiltCard>
            </Reveal>
          );
        })}
        {!loading && (
          <Reveal delay={list.length * 0.08}>
            <TiltCard max={7} onClick={() => navigate(localStorage.getItem('token') ? '/society' : '/auth')} sx={{ height: 400, borderRadius: 7, overflow: 'hidden', color: '#fff', background: 'linear-gradient(150deg,#2f5cff 0%,#5c8dff 100%)', boxShadow: '0 30px 50px -30px #5c8dff', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 3.5 }}>
              <Box component="img" src={photo(PHOTOS.drama)} alt="" loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.28, mixBlendMode: 'luminosity' }} />
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, fontSize: 32, lineHeight: 1.05, mb: 1.2 }}>Running something?</Box>
                <Box sx={{ lineHeight: 1.5, opacity: 0.92, mb: 2.5 }}>Put your event on the shared calendar and let people find you.</Box>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 2.2, py: 1.1, borderRadius: 999, background: '#fff', color: 'var(--ink)', fontWeight: 800 }}>Get started <ArrowOutward sx={{ fontSize: 18 }} /></Box>
              </Box>
            </TiltCard>
          </Reveal>
        )}
      </Box>
    </Box>
  );
};

/* ---------- Vibes mosaic ---------- */
const Vibes = () => {
  const imgs = [
    [PHOTOS.music, 'span 2', 'span 2'], [PHOTOS.photography, 'span 1', 'span 1'], [PHOTOS.volunteer, 'span 1', 'span 2'],
    [PHOTOS.gaming, 'span 1', 'span 1'], [PHOTOS.sports, 'span 2', 'span 1'], [PHOTOS.drama, 'span 1', 'span 1'], [PHOTOS.robotics, 'span 1', 'span 1'],
  ];
  const tint = ['#2f5cff', '#ff4d5e', '#ffe14d', '#5c8dff', '#ffd60a', '#ff4d5e', '#ffe14d'];
  return (
    <Box sx={{ maxWidth: 1180, mx: 'auto', px: 3, mt: { xs: 10, md: 16 } }}>
      <SectionTitle eyebrow="The vibe" sub="This is what happens when people find their thing.">
        Memories are made <span className="grad-text">here</span>
      </SectionTitle>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gridAutoRows: { xs: 150, md: 190 }, gap: 2 }}>
        {imgs.map(([id, c, r], i) => (
          <Reveal key={id} delay={i * 0.06} sx={{ gridColumn: { md: c }, gridRow: { md: r } }}>
            <Box sx={{ position: 'relative', height: '100%', borderRadius: 6, overflow: 'hidden', '&:hover img': { transform: 'scale(1.08)' }, '&:hover .tint': { opacity: 0.55 } }}>
              <Box component="img" src={photo(id, 900)} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .6s ease' }} />
              <Box className="tint" sx={{ position: 'absolute', inset: 0, background: tint[i], mixBlendMode: 'multiply', opacity: 0.15, transition: 'opacity .4s' }} />
            </Box>
          </Reveal>
        ))}
      </Box>
    </Box>
  );
};

const CTA = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  return (
    <Box sx={{ maxWidth: 1180, mx: 'auto', px: 3, mt: { xs: 10, md: 16 } }}>
      <Reveal>
        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 8, p: { xs: 4, md: 9 }, textAlign: 'center', color: '#fff', background: 'linear-gradient(120deg,#2f5cff 0%,#5c8dff 100%)' }}>
          <Box sx={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', right: -80, top: -120, background: 'rgba(255,255,255,.14)' }} />
          <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', left: -50, bottom: -80, background: '#ffd60a' }} />
          <Box sx={{ position: 'relative' }}>
            <Box component="h2" sx={{ m: 0, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, fontSize: { xs: '2.6rem', md: '4.6rem' } }}>
              Your people are<br />already here.
            </Box>
            <Box component="p" sx={{ mt: 2.5, mb: 4, fontSize: { xs: 17, md: 20 }, color: 'rgba(255,255,255,.88)' }}>Create your free account and join your first society in under a minute.</Box>
            <Magnetic>
              <Button size="large" variant="contained" endIcon={<ArrowOutward />} onClick={() => navigate(token ? '/society' : '/auth')} sx={{ background: '#fff', color: 'var(--ink)', boxShadow: '0 18px 36px -12px rgba(0,0,0,.4)', '&:hover': { background: 'var(--butter)' } }}>
                {token ? 'Browse societies' : 'Get started - it\'s free'}
              </Button>
            </Magnetic>
          </Box>
        </Box>
      </Reveal>
    </Box>
  );
};

const SociosphereHomepage = () => {
  const { data: societies = [] } = useSocieties();
  const { data: events = [], isLoading: loading } = useAllEvents();

  return (
    <Box sx={{ overflowX: 'clip' }}>
      <Hero />
      <CategoryMarquee />
      <WhatsOn events={events} societyCount={societies.length} loading={loading} />
      <Vibes />
      <CTA />
    </Box>
  );
};

export default SociosphereHomepage;
