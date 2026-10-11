import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Fade/slide in when scrolled into view
export const Reveal = ({ children, delay = 0, y = 36, x = 0, sx, ...rest }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y, x }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    sx={sx}
    {...rest}
  >
    {children}
  </Box>
);

// 3D tilt that follows the cursor, with a moving glare
export const TiltCard = ({ children, sx, max = 10, onClick, ...rest }) => {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx_ = useSpring(mx, { stiffness: 220, damping: 22 });
  const sy_ = useSpring(my, { stiffness: 220, damping: 22 });
  const rotateY = useTransform(sx_, [0, 1], [-max, max]);
  const rotateX = useTransform(sy_, [0, 1], [max, -max]);
  const glare = useTransform([sx_, sy_], ([x, y]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,.35), transparent 55%)`);

  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const leave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <Box sx={{ perspective: 900, height: '100%' }}>
      <Box
        component={motion.div}
        ref={ref}
        onMouseMove={move}
        onMouseLeave={leave}
        onClick={onClick}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.025 }}
        sx={{ position: 'relative', height: '100%', cursor: onClick ? 'pointer' : 'default', ...sx }}
        {...rest}
      >
        {children}
        <Box component={motion.div} style={{ background: glare }} sx={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', mixBlendMode: 'soft-light' }} />
      </Box>
    </Box>
  );
};

// Counts up when visible
export const Counter = ({ to, suffix = '', duration = 1.6 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / (duration * 1000), 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

// Infinite horizontal ticker
export const Marquee = ({ children, speed = 40, reverse = false, sx }) => (
  <Box sx={{ overflow: 'hidden', width: '100%', maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', ...sx }}>
    <Box sx={{ display: 'flex', width: 'max-content', gap: 2, animation: `ss-marquee ${speed}s linear infinite ${reverse ? 'reverse' : ''}`, '&:hover': { animationPlayState: 'paused' } }}>
      {children}
      {children}
    </Box>
  </Box>
);

// Wrapper that makes an element chase the cursor a little (magnetic button)
export const Magnetic = ({ children, strength = 0.3 }) => {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} style={{ x, y, display: 'inline-block' }} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </motion.div>
  );
};

export const SectionTitle = ({ eyebrow, children, sub, align = 'center', light = false }) => (
  <Box sx={{ textAlign: align, mb: { xs: 5, md: 7 }, maxWidth: 760, mx: align === 'center' ? 'auto' : 0 }}>
    {eyebrow && (
      <Box sx={{ display: 'inline-block', px: 1.8, py: 0.6, mb: 2, borderRadius: 999, fontWeight: 800, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', background: light ? 'rgba(255,255,255,.14)' : 'rgba(47,92,255,.1)', color: light ? '#fff' : 'var(--brand)' }}>
        {eyebrow}
      </Box>
    )}
    <Box component="h2" sx={{ m: 0, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, fontSize: { xs: '2.2rem', md: '3.3rem' }, color: light ? '#fff' : 'var(--ink)' }}>
      {children}
    </Box>
    {sub && <Box component="p" sx={{ mt: 2, mb: 0, fontSize: { xs: 16, md: 18 }, lineHeight: 1.6, color: light ? 'rgba(255,255,255,.75)' : 'text.secondary' }}>{sub}</Box>}
  </Box>
);

// Compact hero used by inner pages (about / contact / societies ...)
export const PageHero = ({ eyebrow, title, sub, children }) => (
  <Box sx={{ position: 'relative', overflow: 'hidden', color: '#fff', background: 'var(--ink)', pt: { xs: 14, md: 17 }, pb: { xs: 8, md: 11 }, mt: '-96px', borderBottomLeftRadius: { xs: 36, md: 64 }, borderBottomRightRadius: { xs: 36, md: 64 } }}>
    <Aurora />
    <Box sx={{ position: 'relative', maxWidth: 1100, mx: 'auto', px: 3, textAlign: 'center' }}>
      {eyebrow && (
        <Reveal>
          <Box sx={{ display: 'inline-block', px: 1.8, py: 0.6, mb: 2.5, borderRadius: 999, fontWeight: 800, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)' }}>{eyebrow}</Box>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <Box component="h1" sx={{ m: 0, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1, fontSize: { xs: '2.8rem', md: '5rem' } }}>{title}</Box>
      </Reveal>
      {sub && (
        <Reveal delay={0.12}>
          <Box component="p" sx={{ mt: 2.5, mb: 0, mx: 'auto', maxWidth: 640, fontSize: { xs: 17, md: 20 }, lineHeight: 1.55, color: 'rgba(255,255,255,.78)' }}>{sub}</Box>
        </Reveal>
      )}
      {children}
    </Box>
  </Box>
);

// Slow-drifting colour blobs used behind dark sections
export const Aurora = () => (
  <Box aria-hidden sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    <Box sx={{ position: 'absolute', width: '55vw', height: '55vw', maxWidth: 720, maxHeight: 720, left: '-12%', top: '-30%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(47,92,255,.75), transparent 65%)', filter: 'blur(30px)', animation: 'ss-aurora 14s ease-in-out infinite' }} />
    <Box sx={{ position: 'absolute', width: '45vw', height: '45vw', maxWidth: 620, maxHeight: 620, right: '-10%', top: '-10%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,141,255,.55), transparent 65%)', filter: 'blur(30px)', animation: 'ss-aurora 18s ease-in-out infinite reverse' }} />
    <Box sx={{ position: 'absolute', width: '40vw', height: '40vw', maxWidth: 560, maxHeight: 560, left: '30%', bottom: '-35%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,225,77,.5), transparent 65%)', filter: 'blur(30px)', animation: 'ss-aurora 22s ease-in-out infinite' }} />
    <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px)', backgroundSize: '26px 26px', maskImage: 'linear-gradient(#000, transparent 85%)', WebkitMaskImage: 'linear-gradient(#000, transparent 85%)' }} />
  </Box>
);

// Photos live in /public/images (downloaded from Pexels, free to use). Each one was checked by eye against its category.
// photo(name) gives the full image; photo(name, w, h) with a height gives the square crop used for the 3D planets.
export const photo = (name, w, h) => process.env.PUBLIC_URL + '/images/' + name + (h ? '-sq' : '') + '.jpg';
export const PHOTOS = {
  music: 'music',           // band on a stage with lights
  concert: 'concert',       // guitarist and crowd
  code: 'code',             // two people reading code on a laptop
  dance: 'dance',           // dancer mid-leap in a studio
  friends: 'friends',       // friends laughing together
  debate: 'debate',         // woman speaking into a microphone at a table
  photography: 'photography', // photographer with a DSLR
  drama: 'drama',           // actors in costume on a theatre stage
  film: 'film',             // film crew with a boom mic
  sports: 'sports',         // football match on a pitch
  volunteer: 'volunteer',   // people planting a tree together
  robotics: 'robotics',     // students building a robot
  gaming: 'gaming',         // friends playing video games
  poetry: 'poetry',         // open book of poetry
};

// Event times are stored as the venue's wall-clock time (as UTC), so always format in UTC.
export const fmtDate = {
  monthShort: (d) => new Date(d).toLocaleString('en', { month: 'short', timeZone: 'UTC' }).toUpperCase(),
  day: (d) => new Date(d).getUTCDate(),
  long: (d) => new Date(d).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
  medium: (d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
  time: (d) => new Date(d).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }),
  key: (d) => new Date(d).toISOString().slice(0, 10),
};

// Split into upcoming (soonest first) and past (most recent first). 'now' is the venue-local wall clock.
export const splitEvents = (events = []) => {
  const now = Date.now();
  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  return {
    upcoming: sorted.filter((e) => new Date(e.date).getTime() >= now),
    past: sorted.filter((e) => new Date(e.date).getTime() < now).reverse(),
  };
};
