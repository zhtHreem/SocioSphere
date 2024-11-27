import mongoose from 'mongoose';

const SocietySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // URL or path to the image
});

// Using the schema to create the model
const Society = mongoose.model('Society', SocietySchema);

export default Society;
