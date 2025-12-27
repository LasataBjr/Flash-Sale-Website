
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {sendMail} = require('../utils/email');
const { multiUpload } = require("../middleware/upload");
const crypto = require("crypto");
const Business = require("../models/Business");
const User = require("../models/User");

const sendError = (res, code, message) => {
  return res.status(code).json({
    success: false,
    message,
  });
};

router.get("/test", (req, res) => {
  res.send("AUTH ROUTE WORKS");
});


/* ================= USER & Business Register ================= */
// router.post("/register", multiUpload, async (req, res) => {
  router.post("/register", (req, res, next) => {
    multiUpload(req, res, function (err) {
      if (err) {
        return sendError(res, 400, err.message);
      }
      next();
    });
  }, async (req, res) => {
  try {
    const { role, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    // USER REG
    if (role === "user") {
      const profile = req.files?.profileImage?.[0]?.filename
        ? `/uploads/profiles/${req.files.profileImage[0].filename}`
        : null;

      await new User({
        fullName: req.body.fullName,
        email,
        password: hashed,
        role,
        profileImage: profile
      }).save();

      return res.json({ success: true });
    }

    // BUSINESS REG
    if (role === "business") {

      if (!req.files?.businessLogo || !req.files?.verificationDocument) {
        return sendError(res, 400, "Business logo & verification document required");
      }
    
      const logoFile = req.files.businessLogo[0].filename;
      const docFile = req.files.verificationDocument[0].filename;
    
      const businessLogo = `/uploads/businessLogo/${logoFile}`;
      const verificationDocument = `/uploads/businessDocs/${docFile}`;
    
      await new Business({
        businessName: req.body.businessName,
        ownerName: req.body.ownerName,
        phone: req.body.phone,
        businessType: req.body.businessType,
        address: req.body.address,
        businessDetail: req.body.businessDetail,
        websiteURL: req.body.websiteURL,
        facebookURL: req.body.facebookURL,
        instagramURL: req.body.instagramURL,
    
        email,
        password: hashed,
        role,
        status: "pending",
        businessLogo,
        verificationDocument
      }).save();
    
      return res.json({ success: true, message: "Pending approval" });
    }
    

    sendError(res, 400, "Invalid role");
  } catch (err) {
    console.log(err);
    console.log("BODY:", req.body);
console.log("FILES:", req.files);
    sendError(res, 500, "Registration failed");
  }
});


/* ================= USER & Business LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user OR business
    let account = await User.findOne({ email }) || await Business.findOne({ email });
    if (!account) return sendError(res, 400, "Account not found");

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return sendError(res, 400, "Incorrect password");

    // Prevent business from actions if not approved
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

    // Create JWT token
    const token = jwt.sign(
      { id: account._id, role: account.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password before sending
    const { password: pwd, ...userData } = account._doc;

    res.json({
      success: true,
      message: "Login success",
      token,
      user: userData  // full info minus password
    });

  } catch (err) {
    console.log(err);
    sendError(res, 500, "Login failed");
  }
});


/* ================= USER & Business Forgot Password ================= */

router.post("/request-reset", async (req, res) => {
  const { email } = req.body;

  const account =
    await User.findOne({ email }) ||
    await Business.findOne({ email });

  if (!account)
    return sendError(res, 404, "Account not found");

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  account.resetPasswordToken = hashedToken;
  account.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await account.save();

  const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <h3>Password Reset</h3>
    <p>Hello ${account.businessName || account.fullName}</p>
    <a href="${resetURL}">Reset Password</a>
  `;

  await sendMail(account.email, "Password Reset", html);

  res.json({ success: true, message: "Reset link sent" });
});

/* ================= USER & Business Reset Password ================= */

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const account =
    await User.findOne({ resetPasswordToken: hashed, resetPasswordExpire: { $gt: Date.now() } }) ||
    await Business.findOne({ resetPasswordToken: hashed, resetPasswordExpire: { $gt: Date.now() } });

  if (!account)
    return sendError(res, 400, "Invalid or expired token");

  account.password = await bcrypt.hash(password, 10);
  account.resetPasswordToken = undefined;
  account.resetPasswordExpire = undefined;
  await account.save();

  res.json({ success: true, message: "Password reset successful" });
});

module.exports = router;