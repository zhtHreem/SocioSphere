import express from 'express';
import Chat from '../models/chat.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Society from '../models/Society.js';
import Notification from '../models/notification.js';
const router = express.Router();

router.get('/:societyId', authMiddleware, async (req, res) => {
  const { societyId } = req.params;
  try {
    const messages = await Chat.find({ society: societyId })
      .sort({ timestamp: 1 })
      .populate('sender', 'username');  // Populate the sender's username

    // Sending the response with populated data
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


router.post('/', authMiddleware, async (req, res) => {
  const { society, message } = req.body;
  const sender = req.user.id;

  if (!society || !message) {
    return res.status(400).json({ error: "Society ID and message are required" });
  }

  try {
    // Save the new message to the Chat collection
    const newMessage = new Chat({ sender, society, message });
    await newMessage.save();

    // Fetch the society to get users who are members
    const societyDoc = await Society.findById(society);
    
    // Create notifications for all users in the society (except the sender)
    const notifications = societyDoc.positions
      .flatMap(position => position.users)  // Get all users in all positions
      .filter(userId => userId.toString() !== sender.toString())  // Exclude the sender from notifications
      .map(userId => ({
        userId,
        message: `New message in ${societyDoc.name}: ${message}`,
      }));

    // Save notifications to the database
    await Notification.insertMany(notifications);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});


export default router;
