import express from 'express';
import Chat from './models/Chat.js';

const router = express.Router();

// Fetch messages for a session
router.get('/:session', async (req, res) => {
  const { session } = req.params;
  try {
    const messages = await Chat.find({ session }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/', async (req, res) => {
  const { sender, content, session } = req.body;
  try {
    const newMessage = new Chat({ sender, content, session });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
