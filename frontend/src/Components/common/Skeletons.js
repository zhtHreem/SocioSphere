import React from 'react';
import { Box, Skeleton } from '@mui/material';

// Reusable loading placeholders. They match the real layouts, so nothing jumps when data arrives.
const R = (n) => ({ borderRadius: n });

export const CardGridSkeleton = ({ count = 6, height = 400, columns = { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' } }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: columns, gap: 3 }} aria-busy="true" aria-label="Loading">
    {Array.from({ length: count }).map((_, i) => <Skeleton key={i} variant="rounded" height={height} animation="wave" sx={R(7)} />)}
  </Box>
);

export const EventRowsSkeleton = ({ count = 4 }) => (
  <Box sx={{ display: 'grid', gap: 1.6 }} aria-busy="true" aria-label="Loading events">
    {Array.from({ length: count }).map((_, i) => (
      <Box key={i} sx={{ display: 'grid', gridTemplateColumns: { xs: '64px 1fr', sm: '78px 1fr 150px' }, gap: 3, alignItems: 'center', p: 2.2, borderRadius: 5, background: '#fff', border: '1px solid rgba(14,16,48,.08)' }}>
        <Skeleton variant="rounded" width={56} height={56} sx={R(3)} />
        <Box><Skeleton width="38%" /><Skeleton height={34} width="72%" /><Skeleton width="50%" /></Box>
        <Skeleton variant="rounded" height={92} sx={{ ...R(3), display: { xs: 'none', sm: 'block' } }} />
      </Box>
    ))}
  </Box>
);

export const ListRowsSkeleton = ({ count = 3 }) => (
  <Box aria-busy="true" aria-label="Loading">
    {Array.from({ length: count }).map((_, i) => (
      <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 2, borderBottom: '1px solid rgba(14,16,48,.08)' }}>
        <Skeleton variant="rounded" width={52} height={52} sx={R(3)} />
        <Box sx={{ flex: 1 }}><Skeleton width="45%" height={28} /><Skeleton width="30%" /></Box>
      </Box>
    ))}
  </Box>
);

// a dark hero band with a title and a few lines, for pages whose header needs data
export const HeroSkeleton = ({ height = 360 }) => (
  <Box aria-busy="true" aria-label="Loading" sx={{ mt: '-96px', pt: 18, pb: 7, height, background: 'var(--ink)', borderBottomLeftRadius: { xs: 36, md: 64 }, borderBottomRightRadius: { xs: 36, md: 64 } }}>
    <Box sx={{ maxWidth: 1180, mx: 'auto', px: 3 }}>
      <Skeleton variant="rounded" width={120} height={120} sx={{ ...R(5), bgcolor: 'rgba(255,255,255,.12)', mb: 2 }} />
      <Skeleton width="55%" height={64} sx={{ bgcolor: 'rgba(255,255,255,.12)' }} />
      <Skeleton width="35%" height={28} sx={{ bgcolor: 'rgba(255,255,255,.1)' }} />
    </Box>
  </Box>
);

export const PageSkeleton = ({ withHero = true }) => (
  <Box>
    {withHero && <HeroSkeleton />}
    <Box sx={{ maxWidth: 1180, mx: 'auto', px: 3, mt: 6, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1fr) 340px' }, gap: 6 }}>
      <Box><Skeleton height={48} width="40%" /><Skeleton /><Skeleton /><Skeleton width="80%" /><Skeleton variant="rounded" height={220} sx={{ ...R(5), mt: 3 }} /></Box>
      <Box><Skeleton variant="rounded" height={320} sx={R(5)} /></Box>
    </Box>
  </Box>
);

export const ChatSkeleton = () => (
  <Box sx={{ p: 3, display: 'grid', gap: 2.5 }} aria-busy="true" aria-label="Loading messages">
    {[0, 1, 2, 3].map((i) => (
      <Box key={i} sx={{ display: 'flex', gap: 1.6 }}>
        <Skeleton variant="circular" width={38} height={38} />
        <Box sx={{ flex: 1 }}><Skeleton width="22%" /><Skeleton width={i % 2 ? '70%' : '45%'} /></Box>
      </Box>
    ))}
  </Box>
);
