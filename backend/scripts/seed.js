// Seed SocioSphere with sample societies, people and events.
//
//   node scripts/seed.js --wipe-old   remove the original (slug-less) societies and everything tied to them
//                                     first, after saving a JSON backup to backend/backups/
//   node scripts/seed.js              just add / refresh the sample content (safe to re-run)
//
// All sample people get random, unrecorded passwords, so they cannot be logged into.
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Society from '../src/models/Society.js';
import Event from '../src/models/Event.js';
import User from '../src/models/user.js';
import ApplyForm from '../src/models/applyForm.js';
import ApplyFormResponse from '../src/models/applyFormResponse.js';
import Chat from '../src/models/chat.js';
import Notification from '../src/models/notification.js';
import { PEOPLE, SOCIETIES, APPLY_QUESTIONS, at } from './seed-data.js';
import { CHAT } from './seed-chat.js';

// A plain three-part running order for every event, based on its start time
const AGENDA = {
  Music: ['Doors open and sign-ups', 'Performances', 'Jam and social'],
  Coding: ['Doors open and setup', 'Main session', 'Show and tell'],
  Dance: ['Warm-up', 'Main session', 'Open floor and social'],
  Debate: ['Registration', 'Main round', 'Feedback and mingling'],
  Photography: ['Meet and brief', 'The walk', 'Sharing frames over a drink'],
  Drama: ['Doors open', 'The main event', 'Chat with the company'],
  Film: ['Doors open', 'Screening', 'Discussion'],
  Sports: ['Warm-up', 'Matches', 'Tea and recap'],
  Volunteering: ['Briefing and kit', 'The main task', 'Refreshments and thank-yous'],
  Robotics: ['Safety briefing', 'Build time', 'Demo and tidy-up'],
  Gaming: ['Doors open', 'Games and brackets', 'Free play'],
  Poetry: ['Doors open', 'Readings', 'Open conversation'],
};
const clock = (iso, plusMin) => {
  const d = new Date(new Date(iso).getTime() + plusMin * 60000);
  return d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
};
const agendaFor = (category, start) => (AGENDA[category] || AGENDA.Music).map((text, i) => ({ time: clock(start, [0, 30, 90][i]), text }));

dotenv.config();
const here = path.dirname(fileURLToPath(import.meta.url));
const wipeOld = process.argv.includes('--wipe-old');

const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '');

await mongoose.connect(process.env.MONGO_URI);
console.log('Connected to', mongoose.connection.name);

// ---------- 1. back up and remove the old content ----------
if (wipeOld) {
  const oldSocieties = await Society.find({ slug: { $exists: false } }).lean();
  const oldIds = oldSocieties.map((s) => s._id);
  const oldEvents = await Event.find({ $or: [{ society: { $in: oldIds } }, { _id: { $in: oldSocieties.flatMap((s) => s.events || []) } }] }).lean();
  const oldForms = await ApplyForm.find({ societyId: { $in: oldIds } }).lean();
  const oldResponses = await ApplyFormResponse.find({ societyId: { $in: oldIds } }).lean();
  const oldChats = await Chat.find({ society: { $in: oldIds } }).lean();
  const oldNotifications = await Notification.find({}).lean();

  const dir = path.join(here, '..', 'backups', new Date().toISOString().replace(/[:.]/g, '-'));
  fs.mkdirSync(dir, { recursive: true });
  const dump = { societies: oldSocieties, events: oldEvents, applyforms: oldForms, applyformresponses: oldResponses, chats: oldChats, notifications: oldNotifications };
  for (const [name, docs] of Object.entries(dump)) fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify(docs, null, 2));
  console.log(`Backed up to ${dir}`);

  const r = {
    societies: (await Society.deleteMany({ _id: { $in: oldIds } })).deletedCount,
    events: (await Event.deleteMany({ _id: { $in: oldEvents.map((e) => e._id) } })).deletedCount,
    applyforms: (await ApplyForm.deleteMany({ societyId: { $in: oldIds } })).deletedCount,
    applyformresponses: (await ApplyFormResponse.deleteMany({ societyId: { $in: oldIds } })).deletedCount,
    chats: (await Chat.deleteMany({ society: { $in: oldIds } })).deletedCount,
    notifications: (await Notification.deleteMany({})).deletedCount,
  };
  console.log('Deleted:', r);
}

// ---------- 2. sample people (leadership teams) ----------
const users = [];
for (const name of PEOPLE) {
  const email = `${slugify(name)}@example.test`;
  let u = await User.findOne({ email });
  if (!u) u = await User.create({ username: name, email, password: crypto.randomBytes(24).toString('hex'), role: 'user' });
  users.push(u);
}
console.log(`People ready: ${users.length}`);

// ---------- 3. societies, events, apply forms ----------
let eventCount = 0;
for (let i = 0; i < SOCIETIES.length; i++) {
  const { events, ...data } = SOCIETIES[i];
  const president = users[(2 * i) % users.length];
  const vice = users[(2 * i + 1) % users.length];
  const positions = [
    { title: 'President', users: [president._id] },
    { title: 'Vice President', users: [vice._id] },
    { title: 'Committee Member', users: [] },
    { title: 'Member', users: [] },
  ];

  const society = await Society.findOneAndUpdate(
    { slug: data.slug },
    { ...data, image: data.cover, positions },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await Event.deleteMany({ society: society._id });
  const created = await Event.insertMany(
    events.map((e) => ({ ...e, date: at(e.date), society: society._id, city: data.city, category: data.category, agenda: agendaFor(data.category, at(e.date)) })),
  );
  society.events = created.map((e) => e._id);
  await society.save();
  eventCount += created.length;

  // conversations
  await Chat.deleteMany({ society: society._id });
  const person = (who) => users[(2 * i + who) % users.length]._id;
  const now = Date.now();
  const lines = (CHAT[data.slug] || []).map(([channel, who, text, ago, x = {}]) => ({
    society: society._id,
    channel,
    sender: person(who),
    message: text,
    image: x.img != null ? data.gallery[x.img] : undefined,
    sticker: x.sticker,
    pinned: Boolean(x.pin),
    reactions: Object.entries(x.react || {}).filter(([, u]) => u.length).map(([emoji, u]) => ({ emoji, users: u.map(person) })),
    timestamp: new Date(now - ago * 60000),
  }));
  if (lines.length) await Chat.insertMany(lines);

  await ApplyForm.deleteMany({ societyId: society._id });
  await ApplyForm.create({
    societyId: society._id,
    title: `Join ${data.name}`,
    description: data.tagline,
    positions,
    userId: president._id,
    questions: APPLY_QUESTIONS(data.name),
  });
  console.log(`  + ${data.name} (${data.city}) with ${created.length} events and ${lines.length} messages`);
}

console.log(`Done: ${SOCIETIES.length} societies, ${eventCount} events.`);
await mongoose.disconnect();
