import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import io from "socket.io-client";
import axios from "axios";
import { ChatSkeleton } from "../common/Skeletons";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, Box, IconButton, Button, Popover, Dialog } from "@mui/material";
import { Send as SendIcon, LockOutlined as LockIcon, SentimentSatisfiedAlt as EmojiIcon, AddPhotoAlternateOutlined as PhotoIcon, EmojiEmotionsOutlined as StickerIcon, PushPin as PinIcon, AddReactionOutlined as ReactIcon, Close } from "@mui/icons-material";

const display = '"Bricolage Grotesque", sans-serif';
const AVATAR_COLORS = ['#3D5AFE', '#FF3D8B', '#0FBF8F', '#8B5CF6', '#0EA5E9', '#E11D74'];
const colorFor = (s = '') => AVATAR_COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length];
const initials = (n = '') => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export const PersonAvatar = ({ name, size = 38 }) => (
  <Avatar sx={{ width: size, height: size, fontSize: size * 0.38, fontWeight: 800, fontFamily: display, bgcolor: colorFor(name) }}>{initials(name)}</Avatar>
);

// Stickers are a big face on a tilted paper cut-out with a caption
export const STICKERS = {
  party: { emoji: '🥳', label: 'Party time', bg: '#FFE1EE' },
  clap: { emoji: '👏', label: 'Bravo', bg: '#DDE4FF' },
  fire: { emoji: '🔥', label: 'On fire', bg: '#FFE7D6' },
  love: { emoji: '😍', label: 'Love it', bg: '#FFE1EE' },
  wave: { emoji: '👋', label: 'Hello!', bg: '#DFF8EE' },
  cool: { emoji: '😎', label: 'Too cool', bg: '#DDF3FF' },
  hype: { emoji: '🙌', label: 'So hyped', bg: '#EBE3FF' },
  thanks: { emoji: '🙏', label: 'Thank you', bg: '#DFF8EE' },
};
const Sticker = ({ id }) => {
  const s = STICKERS[id];
  if (!s) return null;
  return (
    <Box sx={{ display: 'inline-block', transform: 'rotate(-4deg)', p: 1, background: '#fff', borderRadius: 4, boxShadow: '0 6px 16px -6px rgba(14,16,48,.35)' }}>
      <Box sx={{ width: 108, height: 108, borderRadius: 3, display: 'grid', placeItems: 'center', fontSize: 62, background: s.bg }}>{s.emoji}</Box>
      <Box sx={{ textAlign: 'center', fontFamily: display, fontWeight: 800, fontSize: 15, pt: 0.6 }}>{s.label}</Box>
    </Box>
  );
};

const EMOJIS = ['😀', '😂', '🥹', '😍', '😎', '🤩', '🥳', '😅', '😭', '🤔', '🙃', '😴', '👍', '👏', '🙌', '🙏', '💪', '🤝', '👀', '🎉', '🔥', '✨', '💯', '❤️', '💜', '💙', '💚', '🎤', '🎸', '🎬', '📷', '⚽', '🎮', '📚', '☕', '🍕', '🌱', '🌅', '🚀', '💡'];
const QUICK_REACTIONS = ['👍', '❤️', '😂', '🎉', '🔥', '👏', '😮', '🙌'];

const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
const dayLabel = (d) => {
  const t = new Date(d), now = new Date();
  if (sameDay(t, now)) return 'Today';
  if (sameDay(t, new Date(now - 86400000))) return 'Yesterday';
  return t.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
};
const timeLabel = (d) => new Date(d).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

let socket;

// Anyone can read. Typing is open to everyone (and the draft is kept), but sending needs an account.
const Chat = ({ societyId, channel = 'general', placeholderName = 'the community' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const draftKey = `chatDraft:${societyId}:${channel}`;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState(() => { try { return sessionStorage.getItem(draftKey) || ''; } catch { return ''; } });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [needLogin, setNeedLogin] = useState(false);
  const [error, setError] = useState('');
  const [picker, setPicker] = useState(null);       // { type: 'emoji' | 'sticker', anchor }
  const [reactFor, setReactFor] = useState(null);   // { id, anchor }
  const [lightbox, setLightbox] = useState(null);
  const endRef = useRef(null);
  const fileRef = useRef(null);
  const base = process.env.REACT_APP_HOST_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try { const d = jwtDecode(token); setUserId(d.userId || d.id); } catch { /* bad token: treat as logged out */ }
  }, []);

  useEffect(() => { try { sessionStorage.setItem(draftKey, text); } catch { /* storage unavailable */ } }, [text, draftKey]);

  // history is public, so it loads without a token or a socket
  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    setLoading(true); setMessages([]);
    axios.get(`${base}/api/chats/${societyId}`, { params: { channel }, signal: ctrl.signal })
      .then((r) => { if (!cancelled) setMessages(Array.isArray(r.data) ? r.data : []); })
      .catch((e) => { if (!axios.isCancel(e)) console.error('Failed to fetch messages:', e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; ctrl.abort(); };
  }, [societyId, channel, base]);

  useEffect(() => {
    socket = io(base, { reconnection: true, reconnectionAttempts: 5, reconnectionDelay: 1000 });
    const join = () => socket.emit('joinSociety', societyId);
    socket.on('connect', join);
    socket.on('newMessage', (m) => {
      if ((m.channel || 'general') !== channel) return;
      setMessages((prev) => (prev.some((x) => x._id === m._id) ? prev : [...prev, m]));
    });
    socket.on('messageUpdated', (m) => setMessages((prev) => prev.map((x) => (x._id === m._id ? m : x))));
    return () => { socket.emit('leaveSociety', societyId); socket.close(); };
  }, [societyId, channel, base]);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }); }, [messages, loading]);

  const goLogin = () => navigate(`/auth?next=${encodeURIComponent(location.pathname)}`);
  const authHeaders = () => ({ Authorization: localStorage.getItem('token') });

  const post = useCallback(async (payload) => {
    if (!userId) { setNeedLogin(true); return false; }
    setSending(true); setError('');
    try {
      await axios.post(`${base}/api/chats`, { society: societyId, channel, ...payload }, { headers: authHeaders() });
      setNeedLogin(false);
      return true;
    } catch (e) {
      if ([401, 403].includes(e.response?.status)) setNeedLogin(true);
      else setError(e.response?.data?.error || 'Could not send. Try again.');
      return false;
    } finally { setSending(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, societyId, channel, base]);

  const send = async (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    if (await post({ message: text })) setText('');
  };

  const sendSticker = async (id) => { setPicker(null); await post({ sticker: id }); };

  const sendPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!userId) { setNeedLogin(true); return; }
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) { setError('Please choose a JPG, PNG, WebP or GIF image.'); return; }
    if (file.size > 4 * 1024 * 1024) { setError('That image is over 4 MB.'); return; }
    setSending(true); setError('');
    try {
      const form = new FormData();
      form.append('image', file);
      const up = await axios.post(`${base}/api/uploads`, form, { headers: authHeaders() });
      await post({ image: up.data.url, message: text });
      setText('');
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Try again.');
    } finally { setSending(false); }
  };

  const react = async (id, emoji) => {
    setReactFor(null);
    if (!userId) { setNeedLogin(true); return; }
    try { await axios.post(`${base}/api/chats/${id}/react`, { emoji }, { headers: authHeaders() }); }
    catch (err) { if ([401, 403].includes(err.response?.status)) setNeedLogin(true); }
  };

  const pinned = useMemo(() => messages.find((m) => m.pinned), [messages]);
  const rows = useMemo(() => {
    // group messages from the same person within 5 minutes; add a date divider between days
    return messages.map((m, i) => {
      const prev = messages[i - 1];
      const newDay = !prev || !sameDay(prev.timestamp, m.timestamp);
      const grouped = !newDay && prev.sender?._id === m.sender?._id && new Date(m.timestamp) - new Date(prev.timestamp) < 5 * 60000 && !m.sticker && !prev.sticker;
      return { m, newDay, grouped };
    });
  }, [messages]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', minHeight: 0 }}>
      {pinned && (
        <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start', px: 2.5, py: 1.4, background: 'rgba(255,61,139,.07)', borderBottom: '1px solid rgba(255,61,139,.2)' }}>
          <PinIcon sx={{ fontSize: 18, color: 'var(--pink)', mt: '2px' }} />
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ fontSize: 12, fontWeight: 800, color: 'var(--pink)', letterSpacing: '.06em', textTransform: 'uppercase' }}>Pinned by {pinned.sender?.username || 'the team'}</Box>
            <Box sx={{ fontSize: 14.5, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{pinned.message}</Box>
          </Box>
        </Box>
      )}

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: { xs: 1.5, md: 3 }, py: 2 }}>
        {loading ? (
          <ChatSkeleton />
        ) : rows.length === 0 ? (
          <Box sx={{ display: 'grid', placeItems: 'center', height: '100%', textAlign: 'center', color: 'text.secondary' }}>
            <Box><Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 24, color: 'var(--ink)' }}>It's quiet in here</Box>Be the first to say something in #{channel}.</Box>
          </Box>
        ) : rows.map(({ m, newDay, grouped }) => {
          const name = m.sender?.username || 'Member';
          return (
            <React.Fragment key={m._id}>
              {newDay && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2, color: 'text.secondary', fontSize: 12.5, fontWeight: 800 }}>
                  <Box sx={{ flex: 1, height: '1px', background: 'rgba(14,16,48,.1)' }} />{dayLabel(m.timestamp)}<Box sx={{ flex: 1, height: '1px', background: 'rgba(14,16,48,.1)' }} />
                </Box>
              )}
              <Box sx={{ display: 'flex', gap: 1.6, px: 1, py: grouped ? 0.2 : 0.9, borderRadius: 3, position: 'relative', '&:hover': { background: 'rgba(14,16,48,.035)' }, '&:hover .react-btn': { opacity: 1 } }}>
                <Box sx={{ width: 38, flexShrink: 0 }}>{!grouped && <PersonAvatar name={name} />}</Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  {!grouped && (
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.2 }}>
                      <Box sx={{ fontWeight: 800 }}>{name}</Box>
                      <Box sx={{ fontSize: 12, color: 'text.secondary' }}>{timeLabel(m.timestamp)}</Box>
                    </Box>
                  )}
                  {m.message && <Box sx={{ lineHeight: 1.55, wordBreak: 'break-word', whiteSpace: 'pre-wrap', fontSize: 15.5 }}>{m.message}</Box>}
                  {m.image && (
                    <Box component="img" src={m.image} alt="Shared photo" loading="lazy" onClick={() => setLightbox(m.image)} sx={{ display: 'block', mt: 0.8, maxWidth: { xs: '100%', sm: 340 }, maxHeight: 280, borderRadius: 3, cursor: 'zoom-in', objectFit: 'cover' }} />
                  )}
                  {m.sticker && <Box sx={{ mt: 0.6 }}><Sticker id={m.sticker} /></Box>}
                  {m.reactions?.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mt: 0.8 }}>
                      {m.reactions.map((r) => {
                        const mine = r.users.some((u) => String(u?._id || u) === String(userId));
                        return (
                          <Box key={r.emoji} component="button" onClick={() => react(m._id, r.emoji)} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, px: 1, py: 0.2, borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, border: mine ? '1.5px solid var(--blue)' : '1.5px solid rgba(14,16,48,.12)', background: mine ? 'rgba(61,90,254,.1)' : '#fff', color: mine ? 'var(--blue)' : 'var(--ink)' }}>{r.emoji}<span>{r.users.length}</span></Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
                <IconButton className="react-btn" size="small" aria-label="Add reaction" onClick={(e) => setReactFor({ id: m._id, anchor: e.currentTarget })} sx={{ position: 'absolute', right: 8, top: 4, opacity: { xs: 0.6, md: 0 }, background: '#fff', boxShadow: '0 2px 8px rgba(14,16,48,.15)', '&:hover': { background: '#fff' } }}><ReactIcon fontSize="small" /></IconButton>
              </Box>
            </React.Fragment>
          );
        })}
        <div ref={endRef} />
      </Box>

      {needLogin && (
        <Box role="alert" sx={{ px: 2.5, py: 1.4, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', background: 'rgba(61,90,254,.08)', borderTop: '1px solid rgba(61,90,254,.2)' }}>
          <LockIcon sx={{ color: 'var(--blue)' }} />
          <Box sx={{ flex: 1, minWidth: 180, fontWeight: 700, fontSize: 14.5 }}>Log in to send. Your message is saved and will be waiting when you come back.</Box>
          <Button size="small" variant="contained" onClick={goLogin}>Log in</Button>
        </Box>
      )}
      {error && <Box role="alert" sx={{ px: 2.5, py: 1, background: 'rgba(225,29,116,.08)', color: '#B3125B', fontWeight: 700, fontSize: 14 }}>{error}</Box>}

      <Box component="form" onSubmit={send} sx={{ p: { xs: 1.2, md: 2 }, borderTop: '1px solid rgba(14,16,48,.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, background: '#F3F5FF', borderRadius: 4, px: 1, py: 0.6 }}>
          <IconButton aria-label="Add photo" onClick={() => fileRef.current?.click()} disabled={sending}><PhotoIcon /></IconButton>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={sendPhoto} />
          <Box component="textarea" rows={1} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) send(e); }} placeholder={userId ? `Message #${channel}` : `Write something to ${placeholderName} (log in to send)`} aria-label="Message" maxLength={1000} sx={{ flex: 1, border: 0, outline: 0, resize: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 15.5, py: 1.1, maxHeight: 120 }} />
          <IconButton aria-label="Emoji" onClick={(e) => setPicker({ type: 'emoji', anchor: e.currentTarget })}><EmojiIcon /></IconButton>
          <IconButton aria-label="Stickers" onClick={(e) => setPicker({ type: 'sticker', anchor: e.currentTarget })}><StickerIcon /></IconButton>
          <IconButton type="submit" aria-label="Send" disabled={!text.trim() || sending} sx={{ ml: 0.5, background: 'var(--blue)', color: '#fff', '&:hover': { background: '#2A3FC9' }, '&.Mui-disabled': { background: '#dfe3f5', color: '#9aa0c4' } }}><SendIcon fontSize="small" /></IconButton>
        </Box>
      </Box>

      <Popover open={Boolean(picker)} anchorEl={picker?.anchor} onClose={() => setPicker(null)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transformOrigin={{ vertical: 'bottom', horizontal: 'right' }} PaperProps={{ sx: { p: 1.5, borderRadius: 4 } }}>
        {picker?.type === 'emoji' ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 0.3, width: 320 }}>
            {EMOJIS.map((e) => <Box key={e} component="button" onClick={() => setText((t) => t + e)} sx={{ border: 0, background: 'transparent', cursor: 'pointer', fontSize: 24, p: 0.6, borderRadius: 2, '&:hover': { background: 'rgba(14,16,48,.07)' } }}>{e}</Box>)}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, width: 360 }}>
            {Object.entries(STICKERS).map(([id, s]) => (
              <Box key={id} component="button" onClick={() => sendSticker(id)} aria-label={s.label} sx={{ border: 0, cursor: 'pointer', p: 0.8, borderRadius: 3, background: s.bg, textAlign: 'center', '&:hover': { transform: 'scale(1.06) rotate(-3deg)' }, transition: 'transform .15s' }}>
                <Box sx={{ fontSize: 40, lineHeight: 1.2 }}>{s.emoji}</Box>
                <Box sx={{ fontFamily: display, fontWeight: 800, fontSize: 12.5 }}>{s.label}</Box>
              </Box>
            ))}
          </Box>
        )}
      </Popover>

      <Popover open={Boolean(reactFor)} anchorEl={reactFor?.anchor} onClose={() => setReactFor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} PaperProps={{ sx: { p: 0.8, borderRadius: 999 } }}>
        <Box sx={{ display: 'flex' }}>
          {QUICK_REACTIONS.map((e) => <Box key={e} component="button" onClick={() => react(reactFor.id, e)} sx={{ border: 0, background: 'transparent', cursor: 'pointer', fontSize: 22, p: 0.7, borderRadius: '50%', '&:hover': { background: 'rgba(14,16,48,.08)' } }}>{e}</Box>)}
        </Box>
      </Popover>

      <Dialog open={Boolean(lightbox)} onClose={() => setLightbox(null)} maxWidth="lg" PaperProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}>
        <Box sx={{ position: 'relative' }}>
          <Box component="img" src={lightbox || ''} alt="" sx={{ maxWidth: '100%', maxHeight: '86vh', display: 'block', borderRadius: 3 }} />
          <IconButton onClick={() => setLightbox(null)} aria-label="Close" sx={{ position: 'absolute', top: 8, right: 8, background: '#fff', '&:hover': { background: '#fff' } }}><Close /></IconButton>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Chat;
