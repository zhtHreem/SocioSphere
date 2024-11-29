import express from 'express';
import Society from '../models/Society.js';
import Event from '../models/Event.js';
import authMiddleware from '../middleware/authMiddleware.js';
import ApplyForm from '../models/applyForm.js';
import FormResponse from '../models/applyFormResponse.js';
import User from '../models/user.js';
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

// Fetch all societies (GET request)
router.get('/allsocietyresponses', async (req, res) => {
  try {
    // Step 1: Fetch all societies
    const societies = await Society.find();

    // Step 2: Fetch forms for each society
    const societiesWithForms = await Promise.all(societies.map(async (society) => {
     // console.log("Society _id:", society._id);
      // Fetch the forms related to this society using the societyId
       const forms = await FormResponse.find({ societyId: society._id }).populate('userId', 'username');
                                 
    //   console.log("Populated Forms:", forms);

     // console.log("Forms for society with _id:", society._id, forms); // Log forms for the current society
      // Return society and its associated forms
      return {
        ...society.toObject(), // Convert the society mongoose document to a plain object
        forms: forms // Attach the related forms
      };
    }));
    
    //console.log("bruh",societiesWithForms)
    res.status(200).json(societiesWithForms);
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
    // Find the most recent ApplyForm for this society
    const mostRecentForm = await ApplyForm.findOne({ societyId: id }).sort({ createdAt: -1 });

    if (mostRecentForm) {
      // Update the positions in the most recent form
      mostRecentForm.positions = positions;
      await mostRecentForm.save();
      console.log("recent",mostRecentForm)
    }

    if (!updatedSociety) {
      return res.status(404).json({ error: 'Society not found' });
    }
     res.status(200).json(updatedSociety);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update positions', details: error.message });
  }
});


      

// Update positions for a specific society
router.put('/forms/approve/:id', authMiddleware, async (req, res) => {
  console.log("lalal")
  const { id } = req.params; // Form ID
  const { societyId, userId, status, position } = req.body; 
  
  try {

    // Find the society
    const society = await Society.findById(societyId);
        console.log(req.body)

    console.log(society)
    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }

    // Find the specific position
    const positionToUpdate = society.positions.find(pos => pos.title === position);
    console.log("update",positionToUpdate)

   
   if (positionToUpdate.users.includes(userId)) {
     return res.status(400).json({ message: 'User is already assigned to this position' });
    }


    // Save the updated society
    await society.save();
   
    
    res.status(200).json({society, message: 'User is added' });

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update positions', 
      message: 'Failed to update positions', 

      details: error.message 
    });
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
