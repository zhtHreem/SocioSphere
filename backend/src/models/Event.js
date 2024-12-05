import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society' }
});

const Event = mongoose.model('Event', EventSchema);
export default Event;
