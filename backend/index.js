import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http'; // Import to create HTTP server
import { Server } from 'socket.io'; // Import Socket.IO
import mongoose from 'mongoose'; // Import mongoose for graceful shutdown
import connectDB from './src/config/db.js';
import Chat from './src/models/chat.js'; // Import Chat model
import societyRoutes from './src/routes/societyRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js'; // Import chat routes
import User from './src/routes/user.js';
import ApplyForm from './src/routes/applyForm.js';
import applyFormResponse from './src/routes/applyFormResponse.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
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
app.use('/api/chats', chatRoutes); // Add chat routes here
app.use('/api/notifications', notificationRoutes); // Add notification routes here

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
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend's URL
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle joining a specific society room
  socket.on("joinSociety", async (societyId) => {
    console.log(`User ${socket.id} requested to join society room: ${societyId}`);
    socket.join(societyId);
    console.log(`User joined society room: ${societyId}`);

    // Send previous messages to the user who just joined
    try {
      const previousMessages = await Chat.find({ society: societyId }).sort({ timestamp: 1 });
      socket.emit("previousMessages", previousMessages);
    } catch (error) {
      console.error("Error fetching previous messages:", error);
      socket.emit("error", { message: "Failed to load previous messages." });
    }
  });

  socket.on("sendMessage", async (data) => {
    console.log("Message data received:", data);
  
    if (!data.sender || !data.society || !data.message) {
      console.error("Invalid message data:", data);
      socket.emit("error", { message: "Invalid message data. All fields are required." });
      return;
    }
  
    try {
      const newMessage = await Chat.create({
        sender: data.sender,
        society: data.society,
        message: data.message,
      });
      console.log("Message saved to DB:", newMessage);
  
      io.to(data.society).emit("newMessage", newMessage); // Broadcast to room
    } catch (error) {
      console.error("Error saving message to DB:", error);
      socket.emit("error", { message: "Failed to send message." });
    }
  });
  
  

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  httpServer.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
