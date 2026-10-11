import express from 'express';
import Event from '../models/Event.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

// The events the logged-in user said they are going to (must be declared before '/:id')
router.get('/mine/going', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ rsvps: req.user.id }).sort({ date: 1 }).populate('society', 'name logo category city');
    res.status(200).json(events.map((e) => ({ ...e.toObject(), rsvps: undefined })));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public: one event with its society and how many people are going
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('society', 'name logo category city tagline cover image');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const obj = event.toObject();
    res.status(200).json({ ...obj, rsvpCount: obj.rsvps?.length || 0, rsvps: undefined });
  } catch (error) {
    res.status(404).json({ message: 'Event not found' });
  }
});

// Does the logged-in user have a spot? Public events never expose who else is going.
router.get('/:id/rsvp', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).select('rsvps');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ going: event.rsvps.some((u) => String(u) === String(req.user.id)) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle RSVP
router.post('/:id/rsvp', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const has = event.rsvps.some((u) => String(u) === String(req.user.id));
    event.rsvps = has ? event.rsvps.filter((u) => String(u) !== String(req.user.id)) : [...event.rsvps, req.user.id];
    await event.save();
    res.status(200).json({ going: !has, rsvpCount: event.rsvps.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
