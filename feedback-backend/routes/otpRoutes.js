// routes/otpRoutes.js
const express = require("express");
const router = express.Router();
const {
  requestOTP,
  verifyOTP,
  resendOTP,
} = require("../api/controller/otpController");

// OTP Routes
router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

module.exports = router;
