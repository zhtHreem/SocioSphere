import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  society: { type: mongoose.Schema.Types.ObjectId, ref: "societies", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
