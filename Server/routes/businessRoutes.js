const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const {
  multiUpload,
  uploadBusinessLogo
} = require("../middleware/upload");
const Business = require("../models/Business");
const auth = require("../middleware/auth");


const sendError = (res, code, msg) =>
  res.status(code).json({ success: false, message: msg });

/* ================= BUSINESS REGISTER ================= */
router.post("/register", multiUpload, async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      phone,
      email,
      businessType,
      address
    } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    if (!businessName || !ownerName || !email || !password)
      return sendError(res, 400, "Missing fields");

    const exists = await Business.findOne({ email });
    if (exists) return sendError(res, 400, "Email exists");

    if (role === "business") {
      const docFile = req.files?.verificationDocument?.[0]?.filename;
      const logoFile = req.files?.businessLogo?.[0]?.filename;

      const verificationDocument = logoFile ? `/uploads/businessDocs/${docFile}` : null;
      const businessLogo = logoFile ? `/uploads/businessLogo/${logoFile}` : null;

      await new Business({
        ...req.body,
        password: hashed,    
        role: "business",
        status: "pending",
        businessLogo,
        verificationDocument
        }).save();

      return res.json({ success: true, message: "Pending approval" });
    }

    sendError(res, 400, "Invalid role");
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Registration failed");
  }
});   

    




/* ================= BUSINESS FORGOT PASSWORD ================= */
router.post("/request-reset", async (req, res) => {
  const { email } = req.body;

  const business = await Business.findOne({ email });
  if (!business) return sendError(res, 404, "Business not found");

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  business.resetPasswordToken = hashedToken;
  business.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await business.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <h2>Business Password Reset</h2>
    <p>Hello <b>${business.businessName}</b>,</p>
    <p>You requested to reset your business account password.</p>

    <p>
      <a href="${resetUrl}"
         style="padding:10px 20px;background:#dc2626;color:#fff;
                text-decoration:none;border-radius:5px;">
         Reset Password
      </a>
    </p>

    <p>This link will expire in <b>15 minutes</b>.</p>
    <p>If you did not request this, please ignore this email.</p>
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
  }catch (err) {
    console.error(err);

    business.resetPasswordToken = undefined;
    business.resetPasswordExpire = undefined;
    await business.save();

    sendError(res, 500, "Email could not be sent");
  }
});


/* ================= BUSINESS RESET PASSWORD ================= */
router.post("/reset-password/:token", async (req, res) => {
  const { password } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const business = await Business.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!business)
    return sendError(res, 400, "Invalid or expired reset token");

  business.password = await bcrypt.hash(password, 10);
  business.resetPasswordToken = undefined;
  business.resetPasswordExpire = undefined;
  await business.save();

  res.json({
    success: true,
    message: "Business password reset successful"
  });
});



/* ================= UPDATE BUSINESS LOGO ================= */
router.put(
  "/logo",
  auth(["business"]),
  uploadBusinessLogo,
  async (req, res) => {
    if (!req.file) return sendError(res, 400, "No logo");

    const fileUrl = `/uploads/businessLogo/${req.file.filename}`;
    await Business.findByIdAndUpdate(req.user.id, { businessLogo: fileUrl });

    res.json({ success: true, file: fileUrl });
  }
);

module.exports = router;
