import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import societyRoutes from './src/routes/societyRoutes.js';
import User from './src/routes/user.js'
import ApplyForm from './src/routes/applyForm.js';
import applyFormResponse from './src/routes/applyFormResponse.js';
// Route imports
//import authRoutes from './routes/authRoutes.js';



// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
//app.use('/api/auth', authRoutes);
app.use('/api/societies', societyRoutes);
app.use('/api', User);
app.use('/api', ApplyForm);
app.use('/api', applyFormResponse);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'production' ? {} : err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});