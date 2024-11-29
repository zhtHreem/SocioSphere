import express from "express";
import User from "../models/user.js";
import { generateToken } from "../utils/jwtUtils.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Society from "../models/Society.js";

const router = express.Router();
// Register a new user

router.post('/register',async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists.' });

    const user = await User.create({ username, email, password });
    const token = generateToken(user);

    res.status(201).json({ user: { id: user._id, username: user.username, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    res.status(200).json({ user: { id: user._id, username: user.username, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get user profile
router.post('/profile',authMiddleware,async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Fetch user details and their position in societies
router.get('/user/allsociety',authMiddleware, async (req, res) => {
  try {
        const userId = req.user.id; 
    console.log("HAREEM",userId)
    // Step 1: Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 2: Fetch all societies
    const societies = await Society.find();

    // Step 3: Find user's position in societies
    const userSocieties = societies
      .map((society) => {
        // Check positions array for a match
        const matchedPosition = society.positions.find((position) =>
          position.users.some((user) => user.toString() === userId)
        );
         
        console.log("matc",matchedPosition)
        if (matchedPosition) {
          return {
            societyName: society.name, // Assuming society has a `name` field
            positionTitle: matchedPosition.title,
          };
        }
        return null;
      })
      .filter(Boolean); // Remove null values
            console.log("usersociety",userSocieties)
console.log("user",user.username,user.email)
    // Step 4: Respond with user details and positions
    res.status(200).json({
      user: {
        name: user.username,
        email: user.email, // Include any additional user details you need
      },
      societies: userSocieties,
    });
  } catch (error) {
    console.error('Error fetching user societies:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});
export default router;
