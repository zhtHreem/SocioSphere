import express from 'express';
import Society from '../models/Society.js';
import Event from '../models/Event.js';


const router = express.Router();

// Create a new society (POST request)
router.post('/add', async (req, res) => {
  const { name, description, image } = req.body;
  try {
    const newSociety = new Society({ name, description, image });
    await newSociety.save();
    res.status(201).json(newSociety);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Fetch all societies (GET request)
router.get('/', async (req, res) => {
  try {
    const societies = await Society.find();
    res.status(200).json(societies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);
    res.status(200).json(society);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/:id/events', async (req, res) => {
  const { title, date, description, image } = req.body;
  try {
    const society = await Society.findById(req.params.id);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    const newEvent = new Event({ title, date, description, image });
    await newEvent.save();

    society.events.push(newEvent._id);
    await society.save();

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event', error });
  }
});
// Get events for a specific society
router.get('/:id/events', async (req, res) => {
  try {
    const society = await Society.findById(req.params.id).populate('events');
    if (!society) return res.status(404).json({ message: 'Society not found' });

    res.status(200).json(society.events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
});
export default router;
