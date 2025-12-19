const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "business", "admin"], default: "user" },
  resetToken: String,
  resetTokenExpire: Date,
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
