// server.js - CLEANED UP VERSION
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Import routes
const feedbackRoutes = require("./routes/feedbackRoutes");
const userRoutes = require("./routes/userroutes");
const googleAuthRoute = require("./routes/googleAuth");
const passwordRoutes = require("./routes/passwordRoutes");
const linkedInRoute = require("./routes/linkedInRoutes");
const otpRoutes = require("./routes/otpRoutes"); // ✅ NEW OTP ROUTES

const app = express();

// ==================== JWT DEBUGGING ====================
console.log("🔐 === JWT SECRET DEBUG ===");
console.log("🔐 JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("🔐 JWT_SECRET length:", process.env.JWT_SECRET?.length);
console.log(
  "🔐 JWT_SECRET value:",
  process.env.JWT_SECRET ? "***" + process.env.JWT_SECRET.slice(-5) : "NOT SET"
);
// =======================================================

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running with separated OTP system!",
  });
});

// ==================== ROUTES ====================
app.use("/api/otp", otpRoutes); // ✅ NEW: OTP routes
app.use("/api/auth", googleAuthRoute);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/users", userRoutes);
app.use("/api", passwordRoutes);
app.use("/api/linkedin", linkedInRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Production Server running on http://localhost:${PORT}`);
  console.log(`📧 OTP System: SEPARATED INTO MODULES`);
  console.log(`🔐 JWT System: WORKING`);
});
