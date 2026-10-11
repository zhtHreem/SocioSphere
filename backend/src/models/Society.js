import mongoose from 'mongoose';
const SocietySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // URL or path to the image (used as the card/cover image)
  positions: [
    {
      title: { type: String, required: true }, // Position name (e.g., "President", "Officer")
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users holding the position
    },
  ],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // Reference to Event model

  // --- public profile (all optional so older documents keep working) ---
  slug: { type: String, index: true, sparse: true },
  tagline: String,                       // one line that sells the society
  category: String,                      // Music, Coding, Dance ...
  tags: [String],
  city: String,
  logo: String,                          // square logo (path or URL)
  cover: String,                         // wide hero image
  gallery: [String],
  about: [String],                       // paragraphs
  perks: [{ title: String, text: String }], // "what you get"
  audience: [String],                    // "who it's for"
  meets: { day: String, time: String, place: String, cadence: String },
  founded: Number,
  memberCount: Number,                   // stored for now; becomes a live count with the Membership model
  joinMode: { type: String, enum: ['open', 'request', 'apply'], default: 'apply' },
  requirements: [String],                // what joining involves
  socials: { instagram: String, website: String, email: String, whatsapp: String },
  faq: [{ q: String, a: String }],
});

// Using the schema to create the model
const Society = mongoose.model('Society', SocietySchema);
export default Society;
