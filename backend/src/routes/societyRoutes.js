import express from 'express';
import Society from '../models/Society.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

// Create a new society (POST request)
router.post('/add', async (req, res) => {
  const { name, description, image } = req.body;
  try {
    const newSociety = new Society({ name, description, image ,positions: [],});
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



// Update positions for a specific society
router.put('/:id/positions',authMiddleware, async (req, res) => {
  const { id } = req.params; // Society ID
  const { positions } = req.body; // Updated positions data
  console.log("id",id)
  console.log("po",positions)
  try {
    const updatedSociety = await Society.findByIdAndUpdate(
      id,
      { positions },
      { new: true } // Return the updated document
    );

    if (!updatedSociety) {
      return res.status(404).json({ error: 'Society not found' });
    }
     res.status(200).json(updatedSociety);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update positions', details: error.message });
  }
});


export default router;
