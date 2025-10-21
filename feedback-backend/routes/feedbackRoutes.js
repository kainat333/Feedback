const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");
const requireAuth = require("../middleware/requireAuth");

// Submit feedback (protected)
router.post("/submit", requireAuth, async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers are required" });
    }

    const newFeedback = new Feedback({
      user: req.user._id,
      answers,
    });

    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get feedback by user ID (with email)
router.get("/:userId", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.params.userId }).populate(
      "user",
      "email"
    );
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback", error });
  }
});

module.exports = router;
