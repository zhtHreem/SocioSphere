import dns from 'dns';
// Some networks refuse SRV lookups (needed for mongodb+srv); use public resolvers instead
dns.setServers(['8.8.8.8', '1.1.1.1']);
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http'; // Import to create HTTP server
import { Server } from 'socket.io'; // Import Socket.IO
import mongoose from 'mongoose'; // Import mongoose for graceful shutdown
import connectDB from './src/config/db.js';
import Chat from './src/models/chat.js'; // Import Chat model
import compression from 'compression';
import societyRoutes from './src/routes/societyRoutes.js';
import societyAdminRoutes from './src/routes/societyAdminRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js'; // Import chat routes
import User from './src/routes/user.js';
import ApplyForm from './src/routes/applyForm.js';
import applyFormResponse from './src/routes/applyFormResponse.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';
import uploadRoutes, { UPLOAD_DIR } from './src/routes/uploadRoutes.js';
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
//app.use(cors());
app.use(cors({
  origin: [
    process.env.REACT_APP_API_URL,  // Development URL
  ],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));


// Handle preflight requests
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');  // Change '*' to the allowed origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});


app.use(compression());
app.use(express.json({ limit: '100kb' }));

// Connect to Database
connectDB();

// Routes
app.use('/api/societies', societyAdminRoutes); // permissions, ranks, approvals
app.use('/api/societies', societyRoutes);
app.use('/api', User);
app.use('/api', ApplyForm);
app.use('/api', applyFormResponse);
app.use('/api/chats', chatRoutes); // Add chat routes here
app.use('/api/notifications', notificationRoutes); // Add notification routes here
app.use('/api/events', eventRoutes);
app.use('/api/uploads', uploadRoutes);
// uploaded chat pictures; allow the frontend (another origin) to display them
app.use('/uploads', (req, res, next) => { res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); res.setHeader('X-Content-Type-Options', 'nosniff'); next(); }, express.static(UPLOAD_DIR, { maxAge: '7d' }));

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
    origin: process.env.REACT_APP_API_URL, 
    methods: ["GET", "POST"],
  },
  transports: ['websocket', 'polling'], 
   withCredentials: true, 
});

app.set("io", io); // lets route handlers broadcast
// Socket.IO connection logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle joining a specific society room
  socket.on("joinSociety", async (societyId) => {
    socket.join(societyId);
    console.log(`User joined society room: ${societyId}`);
  });

  // Messages are broadcast by the HTTP routes after they are saved and validated, never relayed from a client.
  socket.on("leaveSociety", (societyId) => socket.leave(societyId));

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
