import mongoose from 'mongoose';
import Society from '../models/Society.js';

// A society's ladder is its `positions` array, highest rank first.
//   rank 0  -> "owner"  (the President: can do everything, including promote and demote)
//   rank 1  -> "leader" (e.g. Vice President: events, forms and reviewing applications)
//   any other rank -> "member"
// A site-wide admin (User.role === 'admin') is treated as an owner so the team can help out.
export const DEFAULT_RANKS = ['President', 'Vice President', 'Committee Member', 'Member'];

export const rankIndexOf = (society, userId) =>
  society.positions.findIndex((p) => p.users.some((u) => String(u?._id || u) === String(userId)));

export const roleOf = (society, user) => {
  if (user?.role === 'admin') return 'owner';
  const idx = rankIndexOf(society, user?.id);
  if (idx === 0) return 'owner';
  if (idx === 1) return 'leader';
  return idx > 0 ? 'member' : null;
};

const ORDER = { member: 1, leader: 2, owner: 3 };

// requireRole('leader') lets owners and leaders through. `getSocietyId` finds the society for the route.
export const requireRole = (level, getSocietyId = (req) => req.params.id || req.params.societyId) => async (req, res, next) => {
  try {
    const id = await getSocietyId(req);
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: 'Society not found' });
    const society = await Society.findById(id).select('name positions');
    if (!society) return res.status(404).json({ message: 'Society not found' });
    const role = roleOf(society, req.user);
    if (!role || ORDER[role] < ORDER[level]) {
      return res.status(403).json({ message: level === 'owner' ? 'Only the society\'s President can do that.' : 'Only the society\'s leadership can do that.' });
    }
    req.society = society;
    req.societyRole = role;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
