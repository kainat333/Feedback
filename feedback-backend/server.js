// server.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // ✅ Load environment variables

const feedbackRoutes = require("./routes/feedbackRoutes");
const userRoutes = require("./routes/userroutes");
const googleAuthRoute = require("./routes/googleAuth");
const passwordRoutes = require("./routes/passwordRoutes.js");
const LinkedInRoute = require("./routes/linkedInRoutes.js");

const app = express();

// ✅ Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // your React app URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// ✅ Connect to MongoDB using .env variable
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/auth", googleAuthRoute);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/users", userRoutes);
app.use("/api", passwordRoutes);
app.use("/api/linkedin", LinkedInRoute);
// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(` Server running on http://localhost:${PORT}`)
);
