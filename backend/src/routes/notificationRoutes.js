import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Notification from '../models/notification.js';
const router = express.Router();

// Fetch notifications for the logged-in user
router.get('/user/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
});

export default router;
