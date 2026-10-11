import express from 'express';
import Chat from '../models/chat.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Society from '../models/Society.js';
import Notification from '../models/notification.js';
const router = express.Router();

const CHANNELS = ['general', 'events', 'introductions'];
const ALLOWED_REACTIONS = ['👍', '❤️', '😂', '🎉', '🔥', '👏', '😮', '🙌'];
const isSafeImage = (u) => typeof u === 'string' && (/^\/(uploads|images)\//.test(u) || /^https?:\/\//.test(u)) && u.length < 500;

const populated = (q) => q.populate('sender', 'username');

// Reading a society's chat is public; posting and reacting need login
router.get('/:societyId', async (req, res) => {
  const { societyId } = req.params;
  const channel = CHANNELS.includes(req.query.channel) ? req.query.channel : 'general';
  const limit = Math.min(parseInt(req.query.limit, 10) || 100, 200);
  try {
    // newest N, returned oldest-first so the UI can append
    const messages = await populated(Chat.find({ society: societyId, channel }).sort({ timestamp: -1 }).limit(limit));
    res.status(200).json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Latest few messages across all channels, for the preview on a society page
router.get('/:societyId/recent/preview', async (req, res) => {
  try {
    const messages = await populated(Chat.find({ society: req.params.societyId }).sort({ timestamp: -1 }).limit(4));
    res.status(200).json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { society, message = '', image, sticker } = req.body;
  const channel = CHANNELS.includes(req.body.channel) ? req.body.channel : 'general';
  const sender = req.user.id;

  if (!society || (!message.trim() && !image && !sticker)) {
    return res.status(400).json({ error: 'A society and a message, image or sticker are required' });
  }
  if (message.length > 1000) return res.status(400).json({ error: 'Message is too long' });
  if (image && !isSafeImage(image)) return res.status(400).json({ error: 'Invalid image' });

  try {
    const doc = await Chat.create({ sender, society, channel, message: message.trim(), image: image || undefined, sticker: sticker || undefined });
    const saved = await populated(Chat.findById(doc._id));

    // Broadcast what the server saved (clients can no longer inject their own messages)
    req.app.get('io')?.to(String(society)).emit('newMessage', saved);

    // Notify the people who run the society (except the sender)
    const societyDoc = await Society.findById(society);
    if (societyDoc) {
      const notifications = societyDoc.positions
        .flatMap((position) => position.users)
        .filter((userId) => userId.toString() !== sender.toString())
        .map((userId) => ({ userId, message: `New message in ${societyDoc.name}: ${message.trim() || (image ? 'sent a photo' : 'sent a sticker')}` }));
      if (notifications.length) await Notification.insertMany(notifications);
    }

    res.status(201).json(saved);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Toggle your reaction on a message
router.post('/:id/react', authMiddleware, async (req, res) => {
  const { emoji } = req.body;
  if (!ALLOWED_REACTIONS.includes(emoji)) return res.status(400).json({ error: 'Unsupported reaction' });
  try {
    const msg = await Chat.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    let r = msg.reactions.find((x) => x.emoji === emoji);
    if (!r) { msg.reactions.push({ emoji, users: [req.user.id] }); }
    else if (r.users.some((u) => String(u) === String(req.user.id))) { r.users = r.users.filter((u) => String(u) !== String(req.user.id)); }
    else { r.users.push(req.user.id); }
    msg.reactions = msg.reactions.filter((x) => x.users.length);
    await msg.save();
    const saved = await populated(Chat.findById(msg._id));
    req.app.get('io')?.to(String(msg.society)).emit('messageUpdated', saved);
    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Failed to react' });
  }
});

export default router;
