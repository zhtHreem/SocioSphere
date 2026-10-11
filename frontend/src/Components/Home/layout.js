import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Box, Button, IconButton, Drawer, Typography, Badge } from '@mui/material';
import {
  NotificationsNone as NotificationsIcon,
  PersonOutline as ProfileIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ArrowOutward as ArrowIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import Notifications from '../Home/notifications';
import { Aurora } from './ui';
import LogoMark from './LogoMark';

const NAV_ITEMS = [
  { name: 'Home', link: '/' },
  { name: 'Societies', link: '/society' },
  { name: 'Events', link: '/events' },
  { name: 'About', link: '/about' },
  { name: 'Contact', link: '/contact' },
];

// Mark plus a wordmark set in two weights: "Socio" heavy, "Sphere" regular.
export const Logo = ({ light = true, size = 36 }) => (
  <Box component={Link} to="/" aria-label="SocioSphere home" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.1, textDecoration: 'none', color: light ? '#fff' : 'var(--ink)' }}>
    <LogoMark size={size} />
    <Box component="span" sx={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontSize: size * 0.66, letterSpacing: '-0.035em', lineHeight: 1 }}>
      <Box component="span" sx={{ fontWeight: 800 }}>Socio</Box><Box component="span" sx={{ fontWeight: 400 }}>Sphere</Box>
    </Box>
  </Box>
);

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const token = localStorage.getItem('token');
  const isLoggedIn = Boolean(token);
  let role = null;
  try {
    if (typeof token === 'string' && token.trim() !== '') role = jwtDecode(token)?.role;
  } catch (error) {
    console.error('Error decoding token:', error);
  }
  const profilePath = role === 'admin' ? '/admin' : '/user';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setMobileOpen(false);
    navigate('/auth');
  };

  const isActive = (link) => (link === '/' ? pathname === '/' : pathname.startsWith(link));

  return (
    <>
      <Box
        component={motion.header}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        sx={{ position: 'fixed', top: { xs: 10, md: 16 }, left: 0, right: 0, zIndex: 1200, display: 'flex', justifyContent: 'center', px: { xs: 1.5, md: 3 }, pointerEvents: 'none' }}
      >
        <Box sx={{ pointerEvents: 'auto', width: '100%', maxWidth: 1180, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, pl: { xs: 2, md: 3 }, pr: 1, py: 0.9, borderRadius: 999, color: '#fff', background: scrolled ? 'rgba(14,16,48,.9)' : 'rgba(14,16,48,.78)', backdropFilter: 'blur(18px) saturate(160%)', WebkitBackdropFilter: 'blur(18px) saturate(160%)', border: '1px solid rgba(255,255,255,.16)', boxShadow: scrolled ? '0 18px 40px -16px rgba(14,16,48,.7)' : '0 8px 24px -12px rgba(14,16,48,.5)', transition: 'background .3s, box-shadow .3s' }}>
          <Logo />

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            {NAV_ITEMS.map((item) => (
              <Box key={item.name} component={Link} to={item.link} sx={{ position: 'relative', px: 2, py: 1, borderRadius: 999, fontWeight: 700, fontSize: 15, color: isActive(item.link) ? '#fff' : 'rgba(255,255,255,.7)', textDecoration: 'none', transition: 'color .2s', '&:hover': { color: '#fff' } }}>
                {isActive(item.link) && (
                  <Box component={motion.span} layoutId="nav-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} sx={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'linear-gradient(135deg, rgba(61,90,254,.9), rgba(255,61,139,.85))', zIndex: 0 }} />
                )}
                <Box component="span" sx={{ position: 'relative', zIndex: 1 }}>{item.name}</Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isLoggedIn && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: '#fff' }} aria-label="Notifications">
                  <Badge variant="dot" color="secondary"><NotificationsIcon /></Badge>
                </IconButton>
                <IconButton onClick={() => navigate(profilePath)} sx={{ color: '#fff' }} aria-label="Profile"><ProfileIcon /></IconButton>
                <Button onClick={handleLogout} sx={{ color: 'rgba(255,255,255,.8)', '&:hover': { color: '#fff' } }}>Logout</Button>
              </Box>
            )}
            {!isLoggedIn && (
              <Button onClick={() => navigate('/auth')} variant="contained" endIcon={<ArrowIcon />} sx={{ display: { xs: 'none', md: 'inline-flex' }, background: '#fff', color: 'var(--ink)', boxShadow: 'none', '&:hover': { background: '#19E3B1', boxShadow: 'none' } }}>
                Join free
              </Button>
            )}
            <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' }, color: '#fff' }} aria-label="Open menu"><MenuIcon /></IconButton>
          </Box>
        </Box>
      </Box>

      {/* spacer so inner pages don't hide under the floating bar; heroes pull it back with negative margin */}
      <Box sx={{ height: 96 }} />

      <Notifications anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 'min(86vw, 360px)', background: 'var(--ink)', color: '#fff', borderTopLeftRadius: 32, borderBottomLeftRadius: 32, overflow: 'hidden' } }}>
        <Aurora />
        <Box sx={{ position: 'relative', p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Logo />
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#fff' }}><CloseIcon /></IconButton>
          </Box>
          {NAV_ITEMS.map((item, i) => (
            <Box key={item.name} component={motion.div} initial={{ x: 40, opacity: 0 }} animate={mobileOpen ? { x: 0, opacity: 1 } : {}} transition={{ delay: 0.08 * i + 0.1 }}>
              <Box component={Link} to={item.link} onClick={() => setMobileOpen(false)} sx={{ display: 'block', py: 1.2, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, fontSize: 38, letterSpacing: '-0.03em', textDecoration: 'none', color: isActive(item.link) ? '#19E3B1' : '#fff' }}>{item.name}</Box>
            </Box>
          ))}
          <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {isLoggedIn ? (
              <>
                <Button variant="contained" onClick={() => { setMobileOpen(false); navigate(profilePath); }}>My profile</Button>
                <Button onClick={handleLogout} sx={{ color: '#fff' }}>Logout</Button>
              </>
            ) : (
              <Button variant="contained" size="large" onClick={() => { setMobileOpen(false); navigate('/auth'); }}>Join free</Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

const FOOT_COLS = [
  { title: 'Explore', links: [['Societies', '/society'], ['Events', '/events'], ['About', '/about']] },
  { title: 'Get involved', links: [['Start a society', '/add'], ['Contact us', '/contact']] },
];

const Footer = () => {
  const loggedIn = Boolean(localStorage.getItem('token'));
  const cols = [...FOOT_COLS, { title: 'Account', links: loggedIn ? [['My profile', '/user']] : [['Log in', '/auth'], ['Sign up', '/auth']] }];
  return (
    <Box component="footer" sx={{ position: 'relative', mt: { xs: 9, md: 14 }, background: 'var(--ink)', color: '#fff', overflow: 'hidden', borderTopLeftRadius: { xs: 36, md: 64 }, borderTopRightRadius: { xs: 36, md: 64 } }}>
      <Aurora />
      <Box sx={{ position: 'relative', maxWidth: 1180, mx: 'auto', px: 3, pt: { xs: 6, md: 8 }, pb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1.6fr repeat(3, 1fr)' }, gap: { xs: 4, md: 6 } }}>
          <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
            <Logo />
            <Typography sx={{ mt: 2, maxWidth: 300, color: 'rgba(255,255,255,.65)', lineHeight: 1.6 }}>Find your people, and see what's happening around you.</Typography>
          </Box>
          {cols.map((c) => (
            <Box key={c.title}>
              <Box sx={{ mb: 1.5, fontWeight: 800, fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: '#19E3B1' }}>{c.title}</Box>
              {c.links.map(([name, to]) => (
                <Box key={name} component={Link} to={to} sx={{ display: 'block', py: 0.5, color: 'rgba(255,255,255,.8)', textDecoration: 'none', fontWeight: 600, '&:hover': { color: '#fff' } }}>{name}</Box>
              ))}
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: { xs: 5, md: 7 }, pt: 2.5, borderTop: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.5)', fontSize: 14 }}>© {new Date().getFullYear()} SocioSphere</Box>
      </Box>
    </Box>
  );
};

export { Navbar, Footer };
