import express from 'express';
import Society from '../models/Society.js';

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

export default router;
