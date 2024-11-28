import express from "express";
import FormResponse from "../models/applyFormResponse.js";
import ApplyForm from "../models/applyForm.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Submit a form response
router.post('/responses', authMiddleware, async (req, res) => {
    try {
        const { formId,position, responses } = req.body;

        // Validate that the form exists
        const form = await ApplyForm.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        // Validate responses against form questions
        const validatedResponses = responses.map(response => {
            const formQuestion = form.questions.find(q => q._id.toString() === response.questionId);
            
            if (!formQuestion) {
                throw new Error(`Question with ID ${response.questionId} not found in the form`);
            }

            // Additional validation based on question type
            switch(formQuestion.type) {
                case 'Multiple choice':
                    if (!formQuestion.options.includes(response.answer)) {
                        throw new Error(`Invalid option for multiple choice question: ${response.questionId}`);
                    }
                    break;
                case 'Checkbox':
                    if (!Array.isArray(response.answer) || 
                        !response.answer.every(ans => formQuestion.options.includes(ans))) {
                        throw new Error(`Invalid options for checkbox question: ${response.questionId}`);
                    }
                    break;
                case 'Drop down':
                    if (!formQuestion.options.includes(response.answer)) {
                        throw new Error(`Invalid option for dropdown question: ${response.questionId}`);
                    }
                    break;
            }

            return {
                questionId: response.questionId,
                questionTitle: formQuestion.title,

                answer: response.answer,
                questionType: formQuestion.type
            };
        });

        // Create new form response
        const formResponse = new FormResponse({
            formId,
            position,
            userId: req.user.id,
            responses: validatedResponses
        });

        await formResponse.save();

        res.status(201).json(formResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all responses for a specific form (for form creator)
router.get('/forms/:formId/responses', authMiddleware, async (req, res) => {
    try {
        // First, verify that the user owns the form
        const form = await ApplyForm.findById(req.params.formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }
        if (form.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Fetch all responses for this form
        const responses = await FormResponse.find({ 
            formId: req.params.formId 
        }).populate('userId', 'name email'); // optionally populate user details

        res.status(200).json(responses);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get a specific response by ID (for form creator)
router.get('/responses/:responseId', authMiddleware, async (req, res) => {
    try {
        const response = await FormResponse.findById(req.params.responseId)
            .populate('formId', 'title description')
            .populate('userId', 'name email');

        if (!response) {
            return res.status(404).json({ message: "Response not found" });
        }

        // Verify that the requester is the form creator or the response owner
        const form = await ApplyForm.findById(response.formId);
        if (form.userId.toString() !== req.user.id && response.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update response status (e.g., accept/reject) - for form creator
router.patch('/responses/:responseId/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;

        const response = await FormResponse.findById(req.params.responseId);
        if (!response) {
            return res.status(404).json({ message: "Response not found" });
        }

        // Verify that the requester is the form creator
        const form = await ApplyForm.findById(response.formId);
        if (form.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        response.status = status;
        await response.save();

        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;