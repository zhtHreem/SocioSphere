import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box } from '@mui/material';
import { ArrowBack, Tag } from '@mui/icons-material';
import { useSociety, useTeam } from '../../lib/api';
import { PageSkeleton } from '../common/Skeletons';
import Chat, { PersonAvatar } from './chat';

const display = '"Bricolage Grotesque", sans-serif';
const CHANNELS = [
  ['general', 'Everything and anything'],
  ['events', 'Plans, tickets and reminders'],
  ['introductions', 'New here? Say hello'],
];

// A society's own space: channels on the left, the conversation in the middle.
// Reading is public. Sending asks you to log in (your draft is kept).
const CommunityPage = () => {
  const { id } = useParams();
  const { data: society } = useSociety(id);
  const { data: team = [] } = useTeam(id);
  const [channel, setChannel] = useState('general');
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!society) return <PageSkeleton withHero={false} />;
  const people = team.flatMap((t) => t.people.map((p) => ({ ...p, title: t.title })));

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 1.5, md: 3 }, pb: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px minmax(0, 1fr)' }, height: { md: 'calc(100vh - 130px)' }, minHeight: { md: 560 }, borderRadius: { xs: 5, md: 7 }, overflow: 'hidden', border: '1px solid rgba(18,20,24,.1)', boxShadow: '0 40px 80px -50px rgba(18,20,24,.6)', background: '#fff' }}>
        {/* sidebar */}
        <Box sx={{ background: 'var(--ink)', color: '#fff', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Box component={Link} to={`/society/${id}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5, pt: 2.2, color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: 14, fontWeight: 700, '&:hover': { color: '#fff' } }}><ArrowBack sx={{ fontSize: 17 }} />Back to society</Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 2 }}>
            <Box component="img" src={society.logo} alt="" sx={{ width: 48, height: 48, borderRadius: 3, background: '#fff', p: '2px' }} />
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 18, lineHeight: 1.15 }}>{society.name}</Box>
              <Box sx={{ fontSize: 12.5, opacity: 0.65 }}>{[society.category, society.city].filter(Boolean).join(' · ')}</Box>
            </Box>
          </Box>

          <Box sx={{ px: 1.5, display: { xs: 'flex', md: 'block' }, gap: 1, overflowX: 'auto' }}>
            <Box sx={{ display: { xs: 'none', md: 'block' }, px: 1, pb: 0.8, fontSize: 11.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', opacity: 0.5 }}>Channels</Box>
            {CHANNELS.map(([key, blurb]) => (
              <Box key={key} component="button" onClick={() => setChannel(key)} sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { md: '100%' }, flexShrink: 0, textAlign: 'left', border: 0, cursor: 'pointer', fontFamily: 'inherit', color: '#fff', px: 1.3, py: 1, borderRadius: 3, background: channel === key ? 'rgba(255,255,255,.14)' : 'transparent', '&:hover': { background: 'rgba(255,255,255,.1)' } }}>
                <Tag sx={{ fontSize: 18, opacity: channel === key ? 1 : 0.55 }} />
                <Box><Box sx={{ fontWeight: 800, fontSize: 15 }}>{key}</Box><Box sx={{ display: { xs: 'none', md: 'block' }, fontSize: 12, opacity: 0.6 }}>{blurb}</Box></Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'block' }, px: 2.5, mt: 2.5, minHeight: 0, overflowY: 'auto', pb: 2 }}>
            <Box sx={{ pb: 1, fontSize: 11.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', opacity: 0.5 }}>The team</Box>
            {people.map((p) => (
              <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, py: 0.7 }}>
                <PersonAvatar name={p.name} size={30} />
                <Box sx={{ minWidth: 0 }}><Box sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{p.name}</Box><Box sx={{ fontSize: 12, opacity: 0.6 }}>{p.title}</Box></Box>
              </Box>
            ))}
            <Box sx={{ mt: 2, fontSize: 13, lineHeight: 1.5, opacity: 0.6 }}>Please be kind. The team can remove messages that are not.</Box>
          </Box>
        </Box>

        {/* conversation */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: { xs: 560, md: 'auto' } }}>
          <Box sx={{ px: 3, py: 1.6, borderBottom: '1px solid rgba(18,20,24,.08)', display: 'flex', alignItems: 'baseline', gap: 1.2 }}>
            <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 22 }}># {channel}</Box>
            <Box sx={{ color: 'text.secondary', fontSize: 14 }}>{CHANNELS.find(([k]) => k === channel)?.[1]}</Box>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <Chat societyId={id} channel={channel} placeholderName={society.name} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityPage;
