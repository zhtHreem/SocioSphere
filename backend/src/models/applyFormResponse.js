import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
    formId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ApplyForm', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    position: { type: String, default: "" },
    responses: [{
        questionId: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true 
        },
        questionTitle: {
            type: String,
            required: true
        },
        answer: {
            type: mongoose.Schema.Types.Mixed, // Allows different types of answers
            required: true
        },
        questionType: {
            type: String,
            enum: ["Short answer", "Multiple choice", "Checkbox", "Drop down", "Paragraph"],
            required: true
        }
    }],
    submittedAt: { 
        type: Date, 
        default: Date.now 
    },
    status: {
        type: String,
        enum: ['Submitted', 'Under Review', 'Accepted', 'Rejected'],
        default: 'Submitted'
    }
});

const FormResponse = mongoose.model('applyFormResponse', responseSchema);

export default FormResponse;