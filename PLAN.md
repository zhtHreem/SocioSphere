# Roadmap

SocioSphere started as a university societies project. The goal now is a public platform for any community, anywhere: find a group, see what it does, join it, show up.

## Done

- **Redesign**: new design system, home page, society catalogue, society profile, event pages, events list and calendar, community chat, login and sign-up, profile and About pages. Reusable loading skeletons and a shared query cache on every data page.
- **Public by default**: browsing societies, events and chat needs no account. Posting, RSVPing and applying ask you to log in and return to where you were.
- **Per-society permissions**: President and Vice President can create events and review applications; only the President changes ranks. Anyone logged in can start a society and becomes its President. (Previously any user with the global `admin` role could edit any society, and several write routes needed no login at all.)
- **Ranks UI**: promote, demote, remove, add, rename and delete ranks, saved immediately.
- **Chat**: three channels, reactions, emoji, stickers, photo upload, pinned message. Messages are broadcast by the server after it saves them; clients can no longer inject messages over the socket.
- **Events**: event page with agenda, map link, RSVP and `.ics` download. "Events I'm going to" on the profile.
- **Sample data**: 12 societies, 48 events, conversations and 24 sample people (`backend/scripts/seed.js`).

## Next

1. **Membership model.** Replace "a rank is a list of users inside the society document" with a `Membership` collection: `{ society, user, rank, status, joinedAt }`. This gives a live member count (today `memberCount` is a stored number), makes "my societies" a single query, and removes the O(all societies) scan in `/user/allsociety`.
2. **Join modes that behave differently.** `joinMode` (open, request, apply) is stored and shown, but every society still goes through the application form. Open should be one tap; request should skip the form.
3. **Discover by place.** City and category are stored on societies and events. Add a city filter, a "near me" option and a map (Leaflet + OpenStreetMap needs no key) on the events page.
4. **Timezones.** Store an IANA timezone on each event and format in it, replacing the "venue wall-clock as UTC" shortcut.
5. **Notifications.** Application accepted or rejected, promoted, a new event from a society you follow, RSVP reminders. The notification model exists; only some of these are created.
6. **Moderation.** Delete and report messages, a way to ban someone from a chat, rate limits on posting and uploads.
7. **Storage and hosting.** Object storage for uploaded photos, separate socket server, cache headers and a CDN for `/images`.
8. **Tests.** The permission rules in `societyAccess.js` are the most security-sensitive code and have no automated tests yet; they were checked with a scripted end-to-end run.
9. **Account basics.** Password reset, email verification, delete account.

## Known issues

- `GET /api/user/allsociety` and `GET /api/societies/allsocietyresponses` load every society and scan positions in memory. Fine at this size, replaced by item 1.
- The application review flow still uses the original "review the rank below yours" logic in `/allsocietyresponses`; the new permission checks sit on top of it.
- Sample societies use a stored `memberCount` that does not match the number of real accounts.
- The repository's earlier README published a working admin login (`admin@gmail.com`). It has been removed from the README, but if that account exists in a deployed database its password should be changed.
