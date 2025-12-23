const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { uploadProfileImage } = require("../middleware/upload");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();
const sendError = (res, code, msg) =>
  res.status(code).json({ success: false, message: msg });

/* ================= USER REGISTER ================= */
router.post("/register", uploadProfileImage, async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
      return sendError(res, 400, "All fields required");

    const exists = await User.findOne({ email });
    if (exists) return sendError(res, 400, "Email already exists");

    const hashed = await bcrypt.hash(password, 10);

    const profileImage = req.file
      ? `/uploads/profiles/${req.file.filename}`
      : null;

    await new User({
      fullName,
      email,
      password: hashed,
      role: "user",
      profileImage
    }).save();

    res.json({ success: true, message: "User registered" });
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Registration failed");
  }
});

/* ================= USER LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return sendError(res, 400, "Account not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return sendError(res, 400, "Wrong password");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
    user: { id: user._id, role: user.role, email: user.email }
  });
});

/* ================= USER PROFILE ================= */
router.get("/profile", auth(["user"]), (req, res) => {
  res.json({ success: true, user: req.user });
});

/* ================= UPDATE PROFILE IMAGE ================= */
router.put(
  "/profile/image",
  auth(["user"]),
  uploadProfileImage,
  async (req, res) => {
    if (!req.file) return sendError(res, 400, "No image");

    const fileUrl = `/uploads/profiles/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.id, { profileImage: fileUrl });

    res.json({ success: true, file: fileUrl });
  }
);

module.exports = router;
