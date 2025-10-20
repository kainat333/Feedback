// ./routes/route.js

require("dotenv").config();

const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("../models/user");

const { sendEmail, mailTemplate } = require("../utils/email");

const NumSaltRounds = Number(process.env.NO_OF_SALT_ROUNDS);

router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "You are not registered!",
      });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const resetToken = crypto.createHash("sha256").update(token).digest("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const mailOption = {
      email: email,
      subject: "Forgot Password Link",
      message: mailTemplate(
        "We have received a request to reset your password. Please reset your password using the link below.",
        `${process.env.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`,
        "Reset Password"
      ),
    };

    await sendEmail(mailOption);

    res.json({
      success: true,
      message: "A password reset link has been sent to your email.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/resetPassword", async (req, res) => {
  try {
    console.log("✅ Reset password route hit");
    const { password, token, userId } = req.body;
    const user = await User.findById(userId);

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      return res.json({
        success: false,
        message: "Invalid or expired reset link!",
      });
    }

    const currDateTime = new Date();
    if (currDateTime > user.resetPasswordExpires) {
      return res.json({
        success: false,
        message: "Reset Password link has expired!",
      });
    }

    if (user.resetPasswordToken !== token) {
      return res.json({
        success: false,
        message: "Reset Password link is invalid!",
      });
    }

    // const salt = await bcrypt.genSalt(NumSaltRounds);
    // user.password = await bcrypt.hash(password, salt);
    user.password = password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log("🔐password saved :", user.password);
    res.json({
      success: true,

      message: "Your password reset was successful!",
    });
    console.log("🔐 New password hash:", user.password);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
