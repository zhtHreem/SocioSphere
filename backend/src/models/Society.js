import mongoose from 'mongoose';

const SocietySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] // Reference to Event model
});

const Society = mongoose.model('Society', SocietySchema);
export default Society;
