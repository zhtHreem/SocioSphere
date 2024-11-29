import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    title: String,
    type: { type: String, enum: ["Short answer", "Multiple choice", "Checkbox", "Drop down", "Paragraph"], default: "Short answer" },
    options: [String],  // Only for multiple choice or dropdown
    required: { type: Boolean, default: false },
    newOption: String  // Temporarily stores options added on the frontend
});

const formSchema = new mongoose.Schema({
    societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Society',required: true  }, // Reference to Event model
    title: String,
    description: String,
    positions: [
    {
      title: { type: String, required: true }, // Position name (e.g., "President", "Officer")
      users: [{type:String}]// type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users holding the position
    },
  ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user
    questions: [questionSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ApplyForm = mongoose.model('ApplyForm', formSchema);

export default ApplyForm ;

