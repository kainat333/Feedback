const express = require("express");
const router = express.Router();

console.log("🔍 Checking OTP Controller import...");

try {
  const otpController = require("../api/controller/otpController");
  console.log("✅ OTP Controller loaded:", otpController);
  console.log("📋 Available functions:", Object.keys(otpController));

  const { requestOTP, verifyOTP, resendOTP } = otpController;
  console.log("requestOTP:", typeof requestOTP);
  console.log("verifyOTP:", typeof verifyOTP);
  console.log("resendOTP:", typeof resendOTP);
} catch (error) {
  console.error("❌ Import failed:", error.message);
  process.exit(1);
}

// OTP Routes
router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

module.exports = router;
