import express from "express";
import User from "../models/user.js";
import ApplyForm from "../models/applyForm.js";
import { generateToken } from "../utils/jwtUtils.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Society from "../models/Society.js";
const router = express.Router();



// Create a new form
router.post('/forms/:societyId', authMiddleware, async (req, res) => {
    try {
        console.log(req.params.societyId)
        const { title, description,position, questions } = req.body;
        const society=req.params.societyId
                console.log(society)

        console.log(req.body)
        console.log("user",req.user.id)
        // Create new form with the userId from the JWT
        const form = new ApplyForm({
            societyId:society,
            title,
            description,
            position,
            userId: req.user.id,
            questions,
        });

        await form.save();
        res.status(201).json(form);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// Get a single form by its ID
router.get('/forms/:id',  async (req, res) => {
    try {
     //   console.log('Request Parameters:', req.params);
   // console.log('Authenticated User:', req.user);
   //   console.log("lalal")
       const  id  = req.params.id; // Society ID

        // Step 1: Get the form with the societyId
        const form = await ApplyForm.findOne({ societyId: id }).sort({ createdAt: -1 });
        console.log('form', form);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        


        // Check if form.positions is empty and populate it with society positions if it is
        if (!form.positions || form.positions.length === 0) {
            const society = await Society.findById(form.societyId);

            if (!society) {
                return res.status(404).json({ message: "Society not found" });
            }

            // Use society positions if form positions are empty
            form.positions = society.positions || [];
            console.log('Populated form positions:', form.positions); // Check populated positions
        }
        // Save the updated form with positions from society if necessary
        await form.save();
        res.status(200).json(form);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a form (e.g., change title, description, or questions)
router.put('/forms/:id', authMiddleware, async (req, res) => {
    try {
        const form = await ApplyForm.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }
        if (form.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Update form details
        form.title = req.body.title || form.title;
        form.description = req.body.description || form.description;
        form.questions = req.body.questions || form.questions;

        form.updatedAt = Date.now();
        await form.save();
        res.status(200).json(form);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a form
router.delete('/forms/:id', authMiddleware, async (req, res) => {
    try {
        const form = await ApplyForm.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }
        if (form.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        await form.remove();
        res.status(200).json({ message: "Form deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
