// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Only required if not Google signup
      },
    },
    googleId: {
      type: String, // Store unique Google account ID
      default: null,
    },
  },
  { timestamps: true }
);

// 🔒 Hash password before saving (only if password exists)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🧩 Password comparison method (for login)
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // For Google users
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
