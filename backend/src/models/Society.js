import mongoose from 'mongoose';

const SocietySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
<<<<<<< HEAD
  image: { type: String, required: true },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] // Reference to Event model
=======
  image: { type: String, required: true }, // URL or path to the image
  positions: [
    {
      title: { type: String, required: true }, // Position name (e.g., "President", "Officer")
      users: [{type:String}]// type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users holding the position
    },
  ],
>>>>>>> c850e018d7d53a35dc37bccad927d81b3d033db6
});

const Society = mongoose.model('Society', SocietySchema);
export default Society;
