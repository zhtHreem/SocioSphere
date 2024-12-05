import Notification from '../models/notification.js';
import Society from '../models/Society.js';
import Event from '../models/Event.js';

// Approve a user and notify
export const approveUser = async (req, res) => {
    const { userId, societyId, positionTitle } = req.body;

    try {
        const society = await Society.findById(societyId);
        if (!society) {
            return res.status(404).json({ message: 'Society not found.' });
        }

        const position = society.positions.find(pos => pos.title === positionTitle);
        if (!position) {
            return res.status(404).json({ message: 'Position not found.' });
        }

        position.users.push(userId);
        await society.save();

        const notification = new Notification({
            userId,
            message: `You have been accepted as ${positionTitle} in ${society.name}.`,
        });
        await notification.save();

        res.status(200).json({ message: 'User approved and notified.' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred.', error });
    }
};

// Notify all members when an event is created
export const createEvent = async (req, res) => {
    const { societyId, eventDetails } = req.body;

    try {
        const society = await Society.findById(societyId).populate('positions.users', '_id');
        if (!society) {
            return res.status(404).json({ message: 'Society not found.' });
        }

        const event = new Event(eventDetails);
        await event.save();

        society.events.push(event._id);
        await society.save();

        const usersToNotify = society.positions.reduce((allUsers, position) => {
            return allUsers.concat(position.users.map(user => user._id));
        }, []);

        const notifications = usersToNotify.map(userId => ({
            userId,
            message: `A new event "${event.title}" has been added in ${society.name}.`,
        }));

        await Notification.insertMany(notifications);

        res.status(201).json({ message: 'Event created and notifications sent.' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred.', error });
    }
};

// Fetch notifications for a user
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notifications.', error });
    }
};
