import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society' },
  // optional details shown on the public pages
  venue: String,
  city: String,
  price: { type: String, default: 'Free' },
  category: String,
  agenda: [{ time: String, text: String }],
  rsvps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attendees: Number,                     // headcount for past events, expected for upcoming ones
});

EventSchema.index({ society: 1, date: 1 });
EventSchema.index({ date: 1 });
EventSchema.index({ rsvps: 1 });

const Event = mongoose.model('Event', EventSchema);
export default Event;
