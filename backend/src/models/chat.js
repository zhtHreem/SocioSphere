import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  session: { type: String, required: true }, // Chat session ID or group
});

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;
