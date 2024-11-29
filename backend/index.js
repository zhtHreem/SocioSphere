import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http'; // Import to create HTTP server
import { Server } from 'socket.io'; // Import Socket.IO
import societyRoutes from './src/routes/societyRoutes.js';
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
app.use('/api/societies', societyRoutes);
app.use('/api', User);
app.use('/api', ApplyForm);
app.use('/api', applyFormResponse);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message,
  });
});

// Create an HTTP server
const httpServer = createServer(app);

// Attach Socket.IO to the server
const io = new Server(httpServer, {
  cors: { origin: '*' }, // Allow requests from any origin (adjust in production)
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for incoming messages
  socket.on('message', (msg) => {
    // Broadcast the message to all connected users
    io.emit('message', msg);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
