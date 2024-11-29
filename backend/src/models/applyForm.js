import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    title: String,
    type: { type: String, enum: ["Short answer", "Multiple choice", "Checkbox", "Drop down", "Paragraph"], default: "Short answer" },
    options: [String],  // Only for multiple choice or dropdown
    required: { type: Boolean, default: false },
    newOption: String  // Temporarily stores options added on the frontend
});

const formSchema = new mongoose.Schema({
    title: String,
    description: String,
    position: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user
    questions: [questionSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ApplyForm = mongoose.model('ApplyForm', formSchema);

export default ApplyForm ;

