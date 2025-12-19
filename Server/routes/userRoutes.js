// routes/userRoutes.js
const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();

//Register
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Registration failed" });
  }
});



// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. check user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // 2. check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    // 3. generate token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login success",
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// PROTECTED
router.get("/profile", auth, (req, res) => {
  res.json({ message: "Profile Access Granted", user: req.user });
});

// request password reset
// Request reset link (email sending)
router.post("/request-reset", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // 1. Generate raw token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 2. Hash the token
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // 3. Save hashed token + expire time
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  // 4. Reset URL
  const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  // 5. Email message
  const message = `
    <h3>Password Reset Request</h3>
    <p>Click the link below to reset password:</p>
    <a href="${resetURL}">${resetURL}</a>
    <p>This link expires in 15 minutes.</p>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `Flash Sale <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Password Reset",
      html: message,
    });

    res.json({ message: "Reset link sent to email!" });

  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(500).json({ message: "Email could not be sent" });
  }
});


//add password reset route
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: "Password reset successful!" });
});


router.get("/mail-test", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.SMTP_EMAIL,
      subject: "Mail Test",
      text: "SMTP Working ✔"
    });

    res.json({ message: "Email sent to your inbox!" });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Mail failed" });
  }
});




router.get("/test", (req, res) => {
  res.send("User GET working!");
});

module.exports = router;
