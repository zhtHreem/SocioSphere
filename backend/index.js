import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http'; // Import to create HTTP server
import { Server } from 'socket.io'; // Import Socket.IO
import societyRoutes from './src/routes/societyRoutes.js';
import connectDB from './src/config/db.js';

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
