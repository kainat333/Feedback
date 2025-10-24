const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const User = require("../../models/user");
const { sendOTPEmail } = require("../../utils/emailservice"); // ✅ Enable email service
const jwt = require("jsonwebtoken");

const otpStore = new Map();

// In your OTP controller file - FIX THIS:
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Request OTP - PRODUCTION VERSION
const requestOTP = async (req, res) => {
  try {
    const { email, name, purpose = "registration" } = req.body;

    console.log("📧 OTP requested for:", email);

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    // Check if user already exists for registration
    if (purpose === "registration") {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }
    }

    // Generate 6-digit OTP
    const otp = generateOTP();

    // Store OTP with expiration
    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      purpose: purpose,
      name: name,
      attempts: 0,
    });

    console.log(`📧 OTP generated for ${email}: ${otp}`);

    try {
      // ✅ Send OTP via email (PRODUCTION)
      await sendOTPEmail(email, otp, name);

      // ✅ OTP HIDDEN FROM RESPONSE - Only send success message
      res.json({
        success: true,
        message: "OTP sent successfully to your email",
        expiresIn: "5 minutes",
        // 🚫 NO OTP IN RESPONSE
      });
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);

      // If email fails, still don't send OTP in response for security
      res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please try again.",
      });
    }
  } catch (error) {
    console.error("OTP request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
    });
  }
};

// Verify OTP - PRODUCTION VERSION
const verifyOTP = async (req, res) => {
  try {
    const { email, otp, name, password } = req.body;

    console.log("🔐 OTP verification for:", email);

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const storedData = otpStore.get(email);

    // Check if OTP exists
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not requested. Please request a new OTP.",
      });
    }

    // Check if OTP expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Check attempts
    if (storedData.attempts >= 3) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP.",
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts += 1;
      otpStore.set(email, storedData);

      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please check and try again.",
      });
    }

    // OTP is valid - clear it
    otpStore.delete(email);

    let user;
    let token;

    // Handle registration flow
    if (storedData.purpose === "registration") {
      if (!name || !password) {
        return res.status(400).json({
          success: false,
          message: "Name and password are required for registration",
        });
      }

      // Create new user
      user = new User({
        name: name,
        email: email,
        password: password,
        isVerified: true,
      });

      await user.save();
      token = generateToken(user._id);

      console.log(`✅ New user registered: ${email}`);
    }

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    };

    res.json({
      success: true,
      message: "Registration successful!",
      token: token,
      user: userResponse,
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    res.status(500).json({
      success: false,
      message: "OTP verification failed. Please try again.",
    });
  }
};

// Resend OTP - PRODUCTION VERSION
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const storedData = otpStore.get(email);

    // Check if OTP was previously requested
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "No OTP request found. Please request a new OTP.",
      });
    }

    // Generate new OTP
    const newOTP = generateOTP();

    // Update stored OTP
    otpStore.set(email, {
      otp: newOTP,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      purpose: storedData.purpose,
      name: storedData.name,
      attempts: 0,
    });

    console.log(`📧 New OTP generated for ${email}: ${newOTP}`);

    try {
      // ✅ Send new OTP via email
      await sendOTPEmail(email, newOTP, storedData.name);

      res.json({
        success: true,
        message: "New OTP sent successfully to your email",
        expiresIn: "5 minutes",
        // 🚫 NO OTP IN RESPONSE
      });
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      res.status(500).json({
        success: false,
        message: "Failed to resend OTP email. Please try again.",
      });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP. Please try again.",
    });
  }
};

module.exports = {
  requestOTP,
  verifyOTP,
  resendOTP,
};
