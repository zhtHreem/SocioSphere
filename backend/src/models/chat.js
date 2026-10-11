import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
  emoji: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { _id: false });

const chatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
  channel: { type: String, default: 'general', index: true },   // general, events, introductions ...
  message: { type: String, default: '' },                        // may be empty when it is only an image or sticker
  image: String,                                                 // path or URL of an attached picture
  sticker: String,                                               // key of a sticker, rendered by the frontend
  reactions: [reactionSchema],
  pinned: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

chatSchema.index({ society: 1, channel: 1, timestamp: -1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
