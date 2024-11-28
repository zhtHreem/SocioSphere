import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import societyRoutes from './src/routes/societyRoutes.js';


import connectDB from './src/config/db.js';

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