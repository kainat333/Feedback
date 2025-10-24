const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // ✅ No .default needed

router.post("/google", async (req, res) => {
  try {
    console.log(" Received Google auth request");
    console.log(" Request body:", req.body);

    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    let decoded;
    try {
      decoded = JSON.parse(
        Buffer.from(credential.split(".")[1], "base64").toString()
      );
    } catch (decodeError) {
      console.error("Error decoding credential:", decodeError);
      return res.status(400).json({ message: "Invalid Google token format" });
    }

    // Extract fields from decoded token
    const { email, name, sub: googleId } = decoded;
    console.log("👤 Decoded Google user:", { email, name, googleId });

    if (!email || !googleId) {
      return res
        .status(400)
        .json({ message: "Invalid Google credential data" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    // If new user — create a record
    if (!user) {
      user = await User.create({
        name: name || "Google User",
        email,
        googleId,
      });
      console.log("🆕 New Google user created:", user.email);
    }
    // If user exists but no Google ID — link it
    else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
      console.log("Linked Google account for:", user.email);
    }

    // Generate JWT token
    // Add this at the top of your auth controller file
    if (!process.env.JWT_SECRET) {
      console.error("❌ CRITICAL: JWT_SECRET environment variable is not set!");
      throw new Error("JWT_SECRET is required");
    }

    // Then your token creation
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send successful response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("🔥 Google login error:", error);
    res
      .status(500)
      .json({ message: "Google login failed", error: error.message });
  }
});

module.exports = router;
