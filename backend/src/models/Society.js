const SocietySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // URL or path to the image
  image: { type: String, required: true },
  positions: [
    {
      title: { type: String, required: true }, // Position name (e.g., "President", "Officer")
      users: [{type:String}]// type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users holding the position
    },
  ],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] // Reference to Event model
});

// Using the schema to create the model
const Society = mongoose.model('Society', SocietySchema);
export default Society;
