const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const User = require("../models/User");
const Business = require("../models/Business");

const router = express.Router();

// Helper method
const sendError = (res, code, message) =>
  res.status(code).json({ success: false, message });

// REGISTER (User + Business)
router.post("/register", upload.single("verificationDocument"), async (req, res) => {
  try {
    const { role, email, password } = req.body;

    if (!role || !email || !password)
      return sendError(res, 400, "Role, email & password required");

    // Prevent anyone from registering as ADMIN
    if (role === "admin")
      return sendError(res, 403, "Admin accounts cannot be self-registered");

    // Faster duplicate check using OR operator
    const exists = await User.findOne({ email }) || await Business.findOne({ email });
    if (exists) return sendError(res, 400, "Email already exists");

    const hashed = await bcrypt.hash(password, 10);

    // USER REGISTRATION
    if (role === "user") {
      const { fullName } = req.body;
      if (!fullName) return sendError(res, 400, "Full name required");

      await new User({ fullName, email, password: hashed, role }).save();
      return res.json({ success: true, message: "User registered successfully" });
    }

    // BUSINESS REGISTRATION
    if (role === "business") {
      const {
        businessName, ownerName, phone, businessType,
        address, businessDetail, websiteURL,
        facebookURL, instagramURL
      } = req.body;

      if (!businessName || !ownerName || !phone || !businessType || !address)
        return sendError(res, 400, "Missing required business fields");

      if (!req.file)
        return sendError(res, 400, "Verification document required");

      await new Business({
        businessName,
        ownerName,
        phone,
        email,
        password: hashed,
        businessType,
        address,
        businessDetail,
        websiteURL,
        facebookURL,
        instagramURL,
        verificationDocument: req.file.path,
        role: "business",
        status: "pending" // cannot login until approved
      }).save();

      return res.json({
        success: true,
        message: "Business registered, pending admin approval!"
      });
    }

    return sendError(res, 400, "Invalid role type");
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Registration failed");
  }
});


// LOGIN (User + Business)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let account = await User.findOne({ email }) || await Business.findOne({ email });
    if (!account) return sendError(res, 400, "Account not found");

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return sendError(res, 400, "Incorrect password");

    // Prevent business to add products if not approved
    
    if (account.role === "business" && account.status === "pending") {
      return res.status(403).json({
        status: "pending",
        message: "Your account is awaiting approval.",
      });
    }

    if (account.role === "business" && account.status === "rejected") {
      return res.status(403).json({
        status: "rejected",
        message: "Your account was rejected. Contact support.",
      });
    }
    
    const token = jwt.sign(
      { id: account._id, role: account.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login success",
      token,
      user: {
        id: account._id,
        role: account.role,
        email: account.email
      }
    });
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Login failed");
  }
});


// PROTECTED PROFILE
router.get("/profile", auth, (req, res) => {
  res.json({
    success: true,
    message: "Profile Access Granted",
    user: req.user
  });
});


// REQUEST PASSWORD RESET (supports both User + Business)
router.post("/request-reset", async (req, res) => {
  const { email } = req.body;

  let account = await User.findOne({ email }) || await Business.findOne({ email });
  if (!account) return sendError(res, 404, "Account not found");

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  account.resetPasswordToken = hashedToken;
  account.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await account.save();

  const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const message = `
    <h3>Password Reset Request</h3>
    <p>Reset your password:</p>
    <a href="${resetURL}">${resetURL}</a>
    <p>Link expires in 15 minutes.</p>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
      from: `Flash Sale <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Password Reset",
      html: message
    });

    res.json({ success: true, message: "Reset link sent to email!" });
  } catch (error) {
    console.log(error);
    account.resetPasswordToken = undefined;
    account.resetPasswordExpire = undefined;
    await account.save();
    sendError(res, 500, "Email could not be sent");
  }
});


// RESET PASSWORD (supports both User + Business)
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  let account =
    await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now()  }
    }) ||
    await Business.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() }
    });

  if (!account) return sendError(res, 400, "Invalid or expired token");

  account.password = await bcrypt.hash(password, 10);
  account.resetPasswordToken = undefined;
  account.resetPasswordExpire = undefined;
  await account.save();

  res.json({ success: true, message: "Password reset successful!" });
});


// MAIL TEST
router.get("/mail-test", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.SMTP_EMAIL,
      subject: "Mail Test",
      text: "SMTP Working ✔"
    });

    res.json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Mail failed");
  }
});

router.get("/test", (req, res) => {
  res.send("User GET working!");
});

module.exports = router;
