import express from 'express';
import mongoose from 'mongoose';
import Society from '../models/Society.js';
import User from '../models/user.js';
import FormResponse from '../models/applyFormResponse.js';
import Notification from '../models/notification.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { requireRole, roleOf, rankIndexOf } from '../middleware/societyAccess.js';

const router = express.Router();
const notify = (userId, message) => Notification.create({ userId, message }).catch(() => {});
const rankTitle = (society, idx) => society.positions[idx]?.title;

// What am I in this society? (used by the frontend to decide which buttons to show)
router.get('/:id/me', authMiddleware, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Society not found' });
  const society = await Society.findById(req.params.id).select('positions');
  if (!society) return res.status(404).json({ message: 'Society not found' });
  const idx = rankIndexOf(society, req.user.id);
  res.status(200).json({ role: roleOf(society, req.user), rank: idx >= 0 ? society.positions[idx].title : null });
});

// Who is on the ladder, with ids, for the management screen (owner only)
router.get('/:id/ladder', authMiddleware, requireRole('leader'), async (req, res) => {
  const society = await Society.findById(req.params.id).populate('positions.users', 'username');
  res.status(200).json(society.positions.map((p, i) => ({ index: i, title: p.title, people: p.users.map((u) => ({ id: u._id, name: u.username })) })));
});

// Move a person to another rank: promote (lower index) or demote (higher index). Takes effect immediately.
router.post('/:id/members/:userId/move', authMiddleware, requireRole('owner'), async (req, res) => {
  const to = Number(req.body.toRank);
  const { userId } = req.params;
  const society = await Society.findById(req.params.id);
  if (!Number.isInteger(to) || to < 0 || to >= society.positions.length) return res.status(400).json({ message: 'That rank does not exist.' });
  const from = rankIndexOf(society, userId);
  if (from === to) return res.status(200).json({ ok: true });
  if (from === 0 && society.positions[0].users.length <= 1) return res.status(400).json({ message: 'A society needs a President. Promote someone else to the top rank first.' });
  if (!(await User.exists({ _id: userId }))) return res.status(404).json({ message: 'User not found' });

  society.positions.forEach((p) => { p.users = p.users.filter((u) => String(u) !== String(userId)); });
  society.positions[to].users.push(userId);
  await society.save();
  if (String(userId) !== String(req.user.id)) {
    notify(userId, `${society.name}: you are now ${rankTitle(society, to)}${from >= 0 && to < from ? ' (promoted)' : ''}.`);
  }
  res.status(200).json({ ok: true });
});

// Remove someone from the society. Owners can remove anyone; anyone can remove themselves (leave).
router.delete('/:id/members/:userId', authMiddleware, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Society not found' });
  const society = await Society.findById(req.params.id);
  if (!society) return res.status(404).json({ message: 'Society not found' });
  const target = req.params.userId === 'me' ? req.user.id : req.params.userId;
  const self = String(target) === String(req.user.id);
  if (!self && roleOf(society, req.user) !== 'owner') return res.status(403).json({ message: 'Only the President can remove members.' });
  const idx = rankIndexOf(society, target);
  if (idx < 0) return res.status(404).json({ message: 'Not a member' });
  if (idx === 0 && society.positions[0].users.length <= 1) return res.status(400).json({ message: 'Promote a new President before leaving.' });
  society.positions[idx].users = society.positions[idx].users.filter((u) => String(u) !== String(target));
  await society.save();
  if (!self) notify(target, `You were removed from ${society.name}.`);
  res.status(200).json({ ok: true });
});

// Ranks: add, rename, remove
router.post('/:id/ranks', authMiddleware, requireRole('owner'), async (req, res) => {
  const title = String(req.body.title || '').trim().slice(0, 40);
  if (!title) return res.status(400).json({ message: 'Give the rank a name.' });
  const society = await Society.findById(req.params.id);
  if (society.positions.length >= 10) return res.status(400).json({ message: 'That is plenty of ranks.' });
  if (society.positions.some((p) => p.title.toLowerCase() === title.toLowerCase())) return res.status(400).json({ message: 'A rank with that name already exists.' });
  society.positions.push({ title, users: [] });
  await society.save();
  res.status(201).json({ ok: true });
});

router.patch('/:id/ranks/:index', authMiddleware, requireRole('owner'), async (req, res) => {
  const i = Number(req.params.index);
  const title = String(req.body.title || '').trim().slice(0, 40);
  const society = await Society.findById(req.params.id);
  if (!society.positions[i] || !title) return res.status(400).json({ message: 'Invalid rank.' });
  society.positions[i].title = title;
  await society.save();
  res.status(200).json({ ok: true });
});

router.delete('/:id/ranks/:index', authMiddleware, requireRole('owner'), async (req, res) => {
  const i = Number(req.params.index);
  const society = await Society.findById(req.params.id);
  if (!society.positions[i]) return res.status(404).json({ message: 'Rank not found.' });
  if (i <= 1) return res.status(400).json({ message: 'The two leadership ranks cannot be removed.' });
  if (society.positions[i].users.length) return res.status(400).json({ message: 'Move the people out of this rank first.' });
  society.positions.splice(i, 1);
  await society.save();
  res.status(200).json({ ok: true });
});

// Accept an application. Leaders only. The society comes from the application itself, never from the request body.
router.put('/forms/approve/:id', authMiddleware, requireRole('leader', async (req) => (await FormResponse.findById(req.params.id).select('societyId'))?.societyId), async (req, res) => {
  const application = await FormResponse.findById(req.params.id);
  const society = await Society.findById(application.societyId);
  const applicant = application.userId;

  // join at the rank they applied for, otherwise at the lowest rank
  const wanted = society.positions.findIndex((p) => p.title === (req.body.position || application.position));
  const target = wanted >= 0 ? wanted : society.positions.length - 1;
  if (target <= 1 && req.societyRole !== 'owner') return res.status(403).json({ message: 'Only the President can admit someone into leadership.' });

  society.positions.forEach((p) => { p.users = p.users.filter((u) => String(u) !== String(applicant)); });
  society.positions[target].users.push(applicant);
  await society.save();

  application.status = 'Accepted';
  await application.save();
  notify(applicant, `Welcome to ${society.name}! Your application was accepted. You joined as ${rankTitle(society, target)}.`);
  res.status(200).json({ society, message: 'User is added' });
});

export default router;
