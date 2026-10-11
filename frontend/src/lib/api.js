import axios from 'axios';
import { QueryClient, useQuery } from '@tanstack/react-query';

// One axios instance for the whole app: base URL, a sane timeout, and the login token attached automatically.
export const api = axios.create({ baseURL: process.env.REACT_APP_HOST_URL, timeout: 12000 });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) config.headers.Authorization = token;
  return config;
});

// Shared cache: public data is reused between pages for a minute, so moving around feels instant.
// Requests are de-duplicated, cancelled when you leave the page, and retried once on network errors.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (count, error) => count < 1 && !error.response, // never retry a real 4xx/5xx answer
      refetchOnWindowFocus: false,
    },
  },
});

const get = (url, params) => ({ signal }) => api.get(url, { params, signal }).then((r) => r.data);

// ---- public data ----
export const useSocieties = () => useQuery({ queryKey: ['societies'], queryFn: get('/api/societies'), select: (d) => (Array.isArray(d) ? d : []) });
export const useAllEvents = () => useQuery({ queryKey: ['events'], queryFn: get('/api/societies/events/all'), select: (d) => (Array.isArray(d) ? d : []) });
export const useSociety = (id) => useQuery({ queryKey: ['society', id], queryFn: get(`/api/societies/${id}`), enabled: Boolean(id) });
export const useSocietyEvents = (id) => useQuery({ queryKey: ['society', id, 'events'], queryFn: get(`/api/societies/${id}/events`), enabled: Boolean(id), select: (d) => (Array.isArray(d) ? d : []) });
export const useTeam = (id) => useQuery({ queryKey: ['society', id, 'team'], queryFn: get(`/api/societies/${id}/team`), enabled: Boolean(id), select: (d) => (Array.isArray(d) ? d : []) });
export const useEvent = (id) => useQuery({ queryKey: ['event', id], queryFn: get(`/api/events/${id}`), enabled: Boolean(id) });
export const useChatPreview = (id) => useQuery({ queryKey: ['society', id, 'chatPreview'], queryFn: get(`/api/chats/${id}/recent/preview`), enabled: Boolean(id), staleTime: 15 * 1000, select: (d) => (Array.isArray(d) ? d : []) });

// ---- needs a login (disabled without a token, so logged-out visitors never fire these) ----
const hasToken = () => Boolean(localStorage.getItem('token'));
export const useMyRole = (id) => useQuery({ queryKey: ['society', id, 'me'], queryFn: get(`/api/societies/${id}/me`), enabled: Boolean(id) && hasToken(), staleTime: 30 * 1000 });
export const useMyGoing = () => useQuery({ queryKey: ['me', 'going'], queryFn: get('/api/events/mine/going'), enabled: hasToken(), select: (d) => (Array.isArray(d) ? d : []) });
export const useRsvpState = (id) => useQuery({ queryKey: ['event', id, 'rsvp'], queryFn: get(`/api/events/${id}/rsvp`), enabled: Boolean(id) && hasToken() });
export const useLadder = (id) => useQuery({ queryKey: ['society', id, 'ladder'], queryFn: get(`/api/societies/${id}/ladder`), enabled: Boolean(id) && hasToken(), staleTime: 0 });
