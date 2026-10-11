import express from 'express';
import mongoose from 'mongoose';
import Society from '../models/Society.js';
import Event from '../models/Event.js';
import authMiddleware from '../middleware/authMiddleware.js';
import ApplyForm from '../models/applyForm.js';
import FormResponse from '../models/applyFormResponse.js';
import User from '../models/user.js';
import { requireRole, DEFAULT_RANKS } from '../middleware/societyAccess.js';
import { APPLY_DEFAULT_QUESTIONS } from '../utils/defaults.js';
const router = express.Router();

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};


// Create a new society (POST request)
router.post('/add', authMiddleware, async (req, res) => {
  const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : undefined);
  const name = clean(req.body.name, 80);
  const description = clean(req.body.description, 600);
  const image = clean(req.body.cover || req.body.image, 500);
  if (!name || !description || !image) return res.status(400).json({ message: 'Name, description and a cover image are required.' });
  try {
    if (await Society.findOne({ name: new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') })) {
      return res.status(400).json({ message: 'A society with this name already exists' });
    }
    const joinMode = ['open', 'request', 'apply'].includes(req.body.joinMode) ? req.body.joinMode : 'apply';
    const society = await Society.create({
      name, description, image, cover: image,
      tagline: clean(req.body.tagline, 120), category: clean(req.body.category, 40), city: clean(req.body.city, 60),
      about: [description], joinMode, memberCount: 1, founded: new Date().getFullYear(),
      positions: DEFAULT_RANKS.map((title, i) => ({ title, users: i === 0 ? [req.user.id] : [] })),
    });
    // every society starts with a simple application form so people can ask to join straight away
    await ApplyForm.create({ societyId: society._id, title: 'Join ' + name, description: society.tagline || description, positions: society.positions, userId: req.user.id, questions: APPLY_DEFAULT_QUESTIONS(name) });
    res.status(201).json(society);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all societies (GET request)
router.get('/', async (req, res) => {
  try {
    const societies = await Society.find()
      .select('name description image cover logo tagline category city tags memberCount joinMode founded')
      .sort({ name: 1 }).lean();
    res.set('Cache-Control', 'public, max-age=30');
    res.status(200).json(societies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all societies (GET request)
router.get('/allsocietyresponses', authMiddleware, async (req, res) => {
  try {
    const user = req.user.role; // Get the user's role
    const userId = req.user.id; // Assuming userId is available in the req.user object

    // Step 1: Fetch all societies
    const societies = await Society.find();

    // Step 2: Fetch forms for each society
    const societiesWithForms = await Promise.all(societies.map(async (society) => {
      let forms;

      // Admin: Get all forms from the society of Top Position Users
      if (user === 'admin') {
        console.log("role:", user);
  
       // forms = await FormResponse.find({ societyId: society._id }).populate('userId', 'username');
        
        // For Admin, return the form associated with the first position in the society (index 0)
        const topPosition = society.positions[0];
       // console.log("positions", topPosition);

          if (!topPosition) {
            return {
              ...society.toObject(),
              forms: [], // No next position exists
            };
          }
        // Filter forms to only show those assigned to the top position
        // const topPositionForms = forms.filter(form => {
        //   return topPosition.users.some(user => user.toString() === form.userId._id.toString());
        // });
        forms = await FormResponse.find({
            societyId: society._id,
            position: topPosition.title,
          }).populate('userId', 'username'); 

           console.log("log",forms)

           
          if(forms){

        return {
          ...society.toObject(), // Convert the society mongoose document to a plain object
          forms: forms // Attach the related forms for the top position users
        };
      }
      } 
      
      // User: Only show the user's forms if they exist in the society
      else if (user === 'user') {
    

        // Check if the user is part of the society by looking at the positions array
        const userInSociety = society.positions.some(position => position.users.includes(userId));
        
     
        if (userInSociety) {
               // Find the user's position in the society's positions array
          const userPositionIndex = society.positions.findIndex(position =>  position.users.includes(userId) );



          // If the user isn't part of the society, skip
          if (userPositionIndex === -1) {
            return {
              ...society.toObject(),
              forms: [], // No forms for the user in this society
            };
          }


          // Find the position below the user
          const nextPosition = society.positions[userPositionIndex + 1];
      


          if (!nextPosition) {
            return {
              ...society.toObject(),
              forms: [], // No next position exists
            };
          }
            

         // Fetch forms for the next position (by title)
          const forms = await FormResponse.find({
            societyId: society._id,
            position: nextPosition.title,
          }).populate('userId', 'username'); 

 
          return {
            ...society.toObject(), // Convert the society mongoose document to a plain object
            forms: forms , // Attach the related forms for the user
           
          };
        }
      }
      
      // Default case: Return all forms for the society if neither 'admin' nor 'user' roles are matched
      return {
        ...society.toObject(), // Convert the society mongoose document to a plain object
        forms: forms // Attach the related forms
      };
    }));

    // Send the response with societies and their associated forms
    res.status(200).json(societiesWithForms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// updates position in apply form and society for Positions page
router.put('/:id/positions', authMiddleware, requireRole('owner'), async (req, res) => {
  const { id } = req.params; // Society ID
  const { positions } = req.body; // Updated positions data
 // console.log("id",id)
 // console.log("po",positions)
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
    //  console.log("recent",mostRecentForm)
    }

    if (!updatedSociety) {
      return res.status(404).json({ error: 'Society not found' });
    }
     res.status(200).json(updatedSociety);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update positions', details: error.message });
  }
});


      



// Public: who runs this society (usernames only)
router.get('/:id/team', async (req, res) => {
  try {
    const society = await Society.findById(req.params.id).populate('positions.users', 'username');
    if (!society) return res.status(404).json({ message: 'Society not found' });
    res.status(200).json(society.positions.map((p) => ({
      title: p.title,
      people: p.users.map((u) => ({ id: u._id, name: u.username })),
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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

// Create an event (Admin Only)
router.post('/:id/events', authMiddleware, requireRole('leader'), async (req, res) => {
  const { title, date, description, image, venue, city, price, category } = req.body;
  try {
    const society = await Society.findById(req.params.id);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    const newEvent = new Event({ title, date, description, image, venue, city, price, category, society: society._id });
    await newEvent.save();

    society.events.push(newEvent._id);
    await society.save();

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
});

// Get events for a specific society
router.get('/:id/events', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Society not found' });
    const events = await Event.find({ society: req.params.id }).select('-rsvps').sort({ date: 1 }).lean();
    res.set('Cache-Control', 'public, max-age=15');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});
router.put('/:id/events/:eventId', authMiddleware, requireRole('leader'), async (req, res) => {
  const { title, date, description, image, venue, city, price, category } = req.body;
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      { title, date, description, image, venue, city, price, category },
      { new: true } // Return the updated document
    );
    
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json(event);
  } catch (error) {
    //console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event', error });
  }
});

router.get('/events/all', async (req, res) => {
  try {
    const events = await Event.find().select('-rsvps -agenda').sort({ date: 1 }).populate('society', 'name logo category city').lean();
    res.set('Cache-Control', 'public, max-age=15');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

export default router;
