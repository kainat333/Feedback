// api/controller/otpController.js
const User = require("../../models/user");
const { sendOTPEmail } = require("../../utils/emailservice");
const jwt = require("jsonwebtoken");

// OTP Generator
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const otpStore = new Map();

// Request OTP
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
          message: "User already registered. Please sign in instead.",
        });
      }
    }

    // Generate OTP
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

    // Try to send email using the OTP email service
    try {
      const emailSent = await sendOTPEmail(email, otp, name);

      if (emailSent) {
        res.json({
          success: true,
          message: "OTP sent successfully to your email",
          expiresIn: "5 minutes",
        });
      } else {
        // If email fails, still return success but include OTP for development
        res.json({
          success: true,
          message: "OTP generated (check console for testing)",
          otp: otp,
          expiresIn: "5 minutes",
        });
      }
    } catch (emailError) {
      console.error("❌ Email service error:", emailError.message);
      // Still return success with OTP
      res.json({
        success: true,
        message: "OTP generated successfully",
        otp: otp,
        expiresIn: "5 minutes",
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

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp, name, password } = req.body;

    console.log("🔐 OTP verification for:", email);
    console.log("📝 OTP submitted:", otp);

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

    // Check attempts (3 max)
    if (storedData.attempts >= 3) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP.",
      });
    }

    // Verify OTP properly
    if (storedData.otp !== otp) {
      storedData.attempts += 1;
      otpStore.set(email, storedData);

      console.log(`❌ Wrong OTP attempt ${storedData.attempts}/3 for ${email}`);

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining.`,
      });
    }

    // OTP is valid - clear it
    otpStore.delete(email);
    console.log("✅ OTP verified successfully for:", email);

    // Double check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered. Please sign in.",
      });
    }

    // Create user in database
    try {
      const newUser = new User({
        name: name,
        email: email,
        password: password,
        isVerified: true,
      });

      await newUser.save();
      console.log(`✅ New user registered: ${email}`);

      // Create JWT token
      const token = jwt.sign(
        { id: newUser._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      console.log("✅ Real JWT token created");

      res.json({
        success: true,
        message: "Registration successful!",
        token: token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          isVerified: newUser.isVerified,
        },
      });
    } catch (dbError) {
      if (dbError.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "User already registered. Please sign in.",
        });
      }
      throw dbError;
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "OTP verification failed. Please try again.",
    });
  }
};

// Resend OTP
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
      expiresAt: Date.now() + 5 * 60 * 1000,
      purpose: storedData.purpose,
      name: storedData.name,
      attempts: 0,
    });

    console.log(`📧 New OTP generated for ${email}: ${newOTP}`);

    // Try to send email using the OTP email service
    try {
      const emailSent = await sendOTPEmail(email, newOTP, storedData.name);

      if (emailSent) {
        res.json({
          success: true,
          message: "New OTP sent successfully to your email",
          expiresIn: "5 minutes",
        });
      } else {
        res.json({
          success: true,
          message: "New OTP generated (check console for testing)",
          otp: newOTP,
          expiresIn: "5 minutes",
        });
      }
    } catch (emailError) {
      console.error("❌ Email service error:", emailError.message);
      res.json({
        success: true,
        message: "New OTP generated successfully",
        otp: newOTP,
        expiresIn: "5 minutes",
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
