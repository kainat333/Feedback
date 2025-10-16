const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");

// Submit feedback
router.post("/submit", async (req, res) => {
  console.log("request received in submit");
  try {
    const { userId, answers } = req.body;

    if (!userId || !answers) {
      return res.status(400).json({ message: "Missing userId or answers" });
    }

    const newFeedback = new Feedback({
      user: userId,
      answers,
    });

    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.params.userId });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback", error });
  }
});

module.exports = router;
