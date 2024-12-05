import express from 'express';
import { approveUser, createEvent, getNotifications } from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/approve-user', authMiddleware, approveUser); // Approve user and notify
router.post('/create-event', authMiddleware, createEvent); // Notify users of new events
router.get('/notifications', authMiddleware, getNotifications); // Fetch notifications for user

export default router;
