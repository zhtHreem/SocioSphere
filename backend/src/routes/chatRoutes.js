import express from 'express';
import Chat from '../models/chat.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Fetch messages for a specific society
router.get('/:societyId', authMiddleware, async (req, res) => {
  const { societyId } = req.params;
  try {
    const messages = await Chat.find({ society: societyId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


// Send a message
router.post('/', authMiddleware, async (req, res) => {
  console.log("Request body:", req.body); // Add this line
  console.log("User ID from token:", req.user.id); // Add this line

  const { society, message } = req.body;
  const sender = req.user.id;

  if (!society || !message) {
    return res.status(400).json({ error: "Society ID and message are required" });
  }

  try {
    const newMessage = new Chat({ sender, society, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error); // Add this line
    res.status(500).json({ error: 'Failed to send message' });
  }
});




export default router;
