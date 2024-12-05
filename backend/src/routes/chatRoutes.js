import express from 'express';
import Chat from '../models/chat.js';

const router = express.Router();

// Fetch messages for a specific society
router.get('/:societyId', async (req, res) => {
  const { societyId } = req.params;
  try {
    const messages = await Chat.find({ society: societyId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message (optional for REST-based testing)
router.post('/', async (req, res) => {
  const { sender, society, message } = req.body;
  try {
    const newMessage = new Chat({ sender, society, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
