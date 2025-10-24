const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("🛡️ === AUTH MIDDLEWARE DEBUG ===");
  console.log("🛡️ Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No Bearer token found");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  console.log(
    "🛡️ Token received (first 50 chars):",
    token.substring(0, 50) + "..."
  );

  try {
    // ✅ DEBUG: Check what JWT secret we're using
    console.log(
      "🛡️ JWT Secret from env:",
      process.env.JWT_SECRET ? "***SET***" : "NOT SET"
    );
    console.log("🛡️ JWT Secret length:", process.env.JWT_SECRET?.length);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🛡️ ✅ Token decoded successfully:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("❌ User not found for ID:", decoded.id);
      return res.status(401).json({ message: "User not found" });
    }
    // In your requireAuth.js or right before jwt.verify()
    console.log(
      "🔐 Current JWT Secret (first 10 chars):",
      process.env.JWT_SECRET?.substring(0, 10)
    );
    console.log(
      "🔐 Current JWT Secret length:",
      process.env.JWT_SECRET?.length
    );
    console.log("🛡️ ✅ Auth successful - User:", user.email);
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    console.error("❌ Full error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = requireAuth;
