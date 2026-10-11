import React from 'react';
import { Box, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from './layout';
import { PageHero, Reveal, photo, PHOTOS } from './ui';

const display = '"Bricolage Grotesque", sans-serif';

const PRINCIPLES = [
  ['Open by default', 'You can browse every society, event and conversation without an account. You only sign up when you want to join, post or RSVP.'],
  ['Real people, real places', 'Events have a date, a venue and a price. Societies say when and where they meet. Nothing is hidden behind a "contact us".'],
  ['Run by the people in it', 'Whoever starts a society leads it. They decide the ranks, who gets promoted, and who is let in.'],
  ['Small on purpose', 'A society is a group of people who actually know each other. We would rather help you find twelve good groups than a thousand empty ones.'],
];

const FAQ = [
  ['Is it free?', 'Yes. Browsing, joining and starting a society are free. Some events have their own ticket price, which is shown on the event page.'],
  ['Do I need an account?', 'Not to look around. You need one to join a society, send a message or say you are going to an event.'],
  ['How do I start a society?', 'Create an account, choose "Start a society" and fill in the form. You become its President straight away.'],
  ['Who can create events?', 'The President and the Vice President of that society, and nobody else. Events from one society can never be edited by another.'],
  ['How do people join?', 'They apply on the society page. A leader reviews the application and accepts it, and the new member starts at the lowest rank. The President can promote them whenever they like.'],
  ['What can I share in the chat?', 'Text, emoji, stickers and photos up to 4 MB. Anyone can read a society\'s chat, but only people who are logged in can post.'],
];

const AboutPage = () => (
  <>
    <Navbar />
    <PageHero eyebrow="About" title={<>A place to find your people, and a <span className="grad-text-light">reason to show up</span></>} />

    <Box sx={{ maxWidth: 780, mx: 'auto', px: 3, mt: { xs: 6, md: 10 } }}>
      <Reveal>
        <Box sx={{ fontFamily: display, fontWeight: 700, fontSize: { xs: 26, md: 38 }, lineHeight: 1.25, letterSpacing: '-0.02em' }}>
          Most good things people do together start small. A group chat, a poster on a noticeboard, a friend who says "come along". Then the details get scattered and the group fades.
        </Box>
      </Reveal>
      <Reveal delay={0.05}>
        <Box sx={{ mt: 3, fontSize: 19, lineHeight: 1.75, color: 'text.secondary' }}>
          SocioSphere gives those groups a proper home: a page that says what they are, a calendar of what is coming up, a team that is clearly in charge, and a conversation that anyone can read. It works for a student society, a neighbourhood football club or a poetry circle that meets above a cafe.
        </Box>
      </Reveal>
    </Box>

    <Box sx={{ maxWidth: 1180, mx: 'auto', px: 3, mt: { xs: 7, md: 10 }, display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1.4fr 1fr 1fr' }, gridAutoRows: { xs: 180, md: 300 }, gap: 2 }}>
      {[PHOTOS.music, PHOTOS.volunteer, PHOTOS.dance].map((p, i) => (
        <Box key={p} component="img" src={photo(p)} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6, gridColumn: i === 0 ? { xs: '1 / -1', md: 'auto' } : 'auto' }} />
      ))}
    </Box>

    <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3, mt: { xs: 8, md: 12 } }}>
      <Box component="h2" sx={{ m: 0, mb: 4, fontFamily: display, fontWeight: 800, letterSpacing: '-0.03em', fontSize: { xs: '2rem', md: '3rem' } }}>What we believe</Box>
      {PRINCIPLES.map(([title, text], i) => (
        <Box key={title} sx={{ display: 'grid', gridTemplateColumns: { xs: '48px 1fr', sm: '84px 1fr' }, gap: 2, py: 3, borderTop: '1px solid rgba(18,20,24,.14)', ...(i === PRINCIPLES.length - 1 && { borderBottom: '1px solid rgba(18,20,24,.14)' }) }}>
          <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: { xs: 28, sm: 44 }, lineHeight: 1, letterSpacing: '-0.04em', color: 'var(--brand)' }}>{String(i + 1).padStart(2, '0')}</Box>
          <Box>
            <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: { xs: 21, sm: 26 }, mb: 0.6 }}>{title}</Box>
            <Box sx={{ color: 'text.secondary', fontSize: 17, lineHeight: 1.65, maxWidth: 620 }}>{text}</Box>
          </Box>
        </Box>
      ))}
    </Box>

    <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3, mt: { xs: 8, md: 12 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 5, md: 8 } }}>
      <Box>
        <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 28, mb: 1.5 }}>If you are looking for a group</Box>
        <Box sx={{ color: 'text.secondary', fontSize: 17, lineHeight: 1.7 }}>Search by interest or city, read what a society is like, check when it meets and what its next event is. Read the chat to see whether you would fit in. Then apply, or just turn up to a public event.</Box>
      </Box>
      <Box>
        <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 28, mb: 1.5 }}>If you run one</Box>
        <Box sx={{ color: 'text.secondary', fontSize: 17, lineHeight: 1.7 }}>Set up a page in a few minutes, post events with a venue and price, review applications and decide who leads. Promoting someone, or taking a rank away, takes effect immediately.</Box>
      </Box>
    </Box>

    <Box sx={{ maxWidth: 780, mx: 'auto', px: 3, mt: { xs: 8, md: 12 } }}>
      <Box component="h2" sx={{ m: 0, mb: 3, fontFamily: display, fontWeight: 800, letterSpacing: '-0.03em', fontSize: { xs: '2rem', md: '3rem' } }}>Questions</Box>
      {FAQ.map(([q, a]) => (
        <Accordion key={q} disableGutters elevation={0} sx={{ mb: 1.2, borderRadius: '18px !important', border: '1px solid rgba(18,20,24,.1)', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2.5, '& .MuiAccordionSummary-content': { fontWeight: 800 } }}>{q}</AccordionSummary>
          <AccordionDetails sx={{ px: 2.5, pb: 2.5, color: 'text.secondary', lineHeight: 1.7 }}>{a}</AccordionDetails>
        </Accordion>
      ))}
    </Box>

    <Box sx={{ maxWidth: 780, mx: 'auto', px: 3, mt: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: { xs: 30, md: 44 }, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Go and find yours.</Box>
      <Box sx={{ mt: 3, display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button component={Link} to="/society" variant="contained" size="large">Browse societies</Button>
        <Button component={Link} to="/add" variant="outlined" size="large" sx={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}>Start a society</Button>
      </Box>
    </Box>
    <Footer />
  </>
);

export default AboutPage;
