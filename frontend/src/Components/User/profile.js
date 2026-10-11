import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { Box, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api, useSocieties, useMyGoing } from "../../lib/api";
import { PersonAvatar } from "../Chat/chat";
import { EventRow } from "../Calender/Calender";
import { splitEvents } from "../Home/ui";
import { EventRowsSkeleton, ListRowsSkeleton } from "../common/Skeletons";

// Lazy load the ApplicationTracker component
const ApplicationTracker = lazy(() => import("../SocietyData/ApplicationTracker"));

const display = '"Bricolage Grotesque", sans-serif';
const get = (url) => ({ signal }) => api.get(url, { signal }).then((r) => r.data);

const Section = ({ title, aside, children }) => (
    <Box sx={{ mt: { xs: 7, md: 9 } }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 2.5, pb: 1.5, borderBottom: '3px solid var(--ink)' }}>
            <Box component="h2" sx={{ m: 0, fontFamily: display, fontWeight: 800, letterSpacing: '-0.03em', fontSize: { xs: '1.8rem', md: '2.4rem' } }}>{title}</Box>
            {aside}
        </Box>
        {children}
    </Box>
);

const Empty = ({ title, text, to, cta }) => (
    <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 5, border: '2px dashed rgba(14,16,48,.18)' }}>
        <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 22 }}>{title}</Box>
        <Box sx={{ color: 'text.secondary', mt: 0.5, mb: 2 }}>{text}</Box>
        <Button component={Link} to={to} variant="contained">{cta}</Button>
    </Box>
);

function User() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(() => { if (!token) navigate('/auth?next=/user'); }, [token, navigate]);

    // everything about me is cached, so coming back to this page is instant
    const { data: mine, isLoading: mineLoading } = useQuery({ queryKey: ['me', 'societies'], queryFn: get('/api/user/allsociety'), enabled: Boolean(token) });
    const { data: forms } = useQuery({ queryKey: ['me', 'forms'], queryFn: get('/api/societies/allsocietyresponses'), enabled: Boolean(token) });
    const { data: profile } = useQuery({ queryKey: ['me', 'profile'], queryFn: ({ signal }) => api.post('/api/user/profile', {}, { signal }).then((r) => r.data.user), enabled: Boolean(token) });
    const { data: directory = [] } = useSocieties();
    const { data: going = [], isLoading: goingLoading } = useMyGoing();

    const user = mine?.user || {};
    const userSocieties = mine?.societies || [];
    const societies = useMemo(() => (Array.isArray(forms) ? forms.filter((s) => userSocieties.some((us) => us.societyName === s.name)) : []), [forms, userSocieties]);

    const [selectedTab, setSelectedTab] = useState('');
    const [selectedForm, setSelectedForm] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => { if (!selectedTab && societies[0]) setSelectedTab(societies[0].name); }, [societies, selectedTab]);
    const selectedSociety = societies.find((s) => s.name === selectedTab) || null;

    const { upcoming } = splitEvents(going);
    const since = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en', { month: 'long', year: 'numeric' }) : '';
    const byName = (name) => directory.find((s) => s.name === name);

    if (!token) return null;

    return (
        <Box sx={{ pb: 4 }}>
            {/* header */}
            <Box sx={{ background: 'var(--ink)', color: '#fff', mt: '-96px', pt: { xs: 16, md: 19 }, pb: { xs: 6, md: 8 }, borderBottomLeftRadius: { xs: 36, md: 64 }, borderBottomRightRadius: { xs: 36, md: 64 } }}>
                <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3, display: 'flex', alignItems: 'center', gap: { xs: 2.5, md: 4 }, flexWrap: 'wrap' }}>
                    <PersonAvatar name={user.name || '?'} size={96} />
                    <Box>
                        <Box component="h1" sx={{ m: 0, fontFamily: display, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, fontSize: { xs: '2.4rem', md: '4rem' }, minHeight: '1em' }}>{user.name || (mineLoading ? '' : 'Your profile')}</Box>
                        <Box sx={{ mt: 1.2, opacity: 0.75, fontSize: { xs: 15, md: 17 } }}>{[user.email, since && `Member since ${since}`].filter(Boolean).join(' · ')}</Box>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3 }}>
                <Section title="Coming up for you" aside={<Button component={Link} to="/events" sx={{ color: 'var(--ink)', fontWeight: 800 }}>Find more</Button>}>
                    {goingLoading ? <EventRowsSkeleton count={2} /> : upcoming.length ? (
                        <Box sx={{ display: 'grid', gap: 1.6 }}>{upcoming.map((e, i) => <EventRow key={e._id} e={e} index={i} />)}</Box>
                    ) : (
                        <Empty title="Nothing planned yet" text="Open any event and tap I'm going. It will show up here." to="/events" cta="Browse events" />
                    )}
                </Section>

                <Section title="Your communities" aside={<Button component={Link} to="/add" sx={{ color: 'var(--ink)', fontWeight: 800 }}>Start a society</Button>}>
                    {mineLoading ? <ListRowsSkeleton count={2} /> : userSocieties.length ? (
                        <Box>
                            {userSocieties.map((us, i) => {
                                const s = byName(us.societyName);
                                return (
                                    <Box key={us.societyName + i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, borderBottom: '1px solid rgba(14,16,48,.1)', flexWrap: 'wrap' }}>
                                        {s?.logo ? <Box component="img" src={s.logo} alt="" sx={{ width: 56, height: 56, borderRadius: 3.5 }} /> : <PersonAvatar name={us.societyName} size={56} />}
                                        <Box sx={{ flex: 1, minWidth: 180 }}>
                                            <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 22, lineHeight: 1.15 }}>{us.societyName}</Box>
                                            <Box sx={{ color: 'text.secondary' }}>{us.positionTitle}{s?.city ? ` · ${s.city}` : ''}</Box>
                                        </Box>
                                        {s && <Button component={Link} to={`/society/${s._id}`} sx={{ color: 'var(--ink)', fontWeight: 800 }}>Open</Button>}
                                        {s && <Button component={Link} to={`/society/${s._id}/community`} variant="outlined" sx={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}>Chat</Button>}
                                    </Box>
                                );
                            })}
                        </Box>
                    ) : (
                        <Empty title="You haven't joined a community yet" text="Find one that fits and apply in a minute, or start your own." to="/society" cta="Browse societies" />
                    )}
                </Section>

                {(societies.length > 0) && (
                    <Section title="Applications">
                        <Suspense fallback={<ListRowsSkeleton count={2} />}>
                            <ApplicationTracker
                                societies={societies}
                                selectedTab={selectedTab}
                                handleTabChange={(_, newValue) => setSelectedTab(newValue)}
                                selectedSociety={selectedSociety}
                                handleFormSelect={(form) => { setSelectedForm(form); setIsModalOpen(true); }}
                                selectedForm={selectedForm}
                                isModalOpen={isModalOpen}
                                setIsModalOpen={setIsModalOpen}
                            />
                        </Suspense>
                    </Section>
                )}
            </Box>
        </Box>
    );
}

export default User;
