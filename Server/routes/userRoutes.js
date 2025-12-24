const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { multiUpload, uploadProfileImage } = require("../middleware/upload");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();
const sendError = (res, code, msg) =>
  res.status(code).json({ success: false, message: msg });

/* ================= USER REGISTER ================= */
router.post("/register", multiUpload, async (req, res) => {
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

    sendError(res, 400, "Invalid role");
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Registration failed");
  }
});


/* ================= USER & Business LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailNormalized = email.trim().toLowerCase();

    let account =
      (await User.findOne({ email: emailNormalized })) ||
      (await Business.findOne({ email: emailNormalized }));

    if (!account) return sendError(res, 400, "Account not found");

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return sendError(res, 400, "Incorrect password");

    // Business status check
    if (account.role === "business" && account.status !== "approved") {
      return res.json({
        success: false,
        user: {
          role: account.role,
          status: account.status,
        },
        message:
          account.status === "pending"
            ? "Your account is awaiting approval ❌"
            : "Your account was rejected ❌",
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
        email: account.email,
        status: account.status || null
      }
    });
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Login failed");
  }
});



/* ================= FORGOT PASSWORD ================= */
router.post("/request-reset", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return sendError(res, 404, "User not found");

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  // 📧 Email HTML
  const message = `
    <h2>Password Reset Request</h2>
    <p>Hello <b>${user.fullName}</b>,</p>
    <p>You requested to reset your password.</p>
    <p>
      <a href="${resetUrl}" 
         style="padding:10px 20px;background:#2563eb;color:#fff;
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
  } catch (error) {
    console.log(error);
    account.resetPasswordToken = undefined;
    account.resetPasswordExpire = undefined;
    await account.save();
    sendError(res, 500, "Email could not be sent");
  }
});


// RESET PASSWORD ================================
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  let account =
    await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now()  }
    });

  if (!account) return sendError(res, 400, "Invalid or expired token");

  account.password = await bcrypt.hash(password, 10);
  account.resetPasswordToken = undefined;
  account.resetPasswordExpire = undefined;
  await account.save();

  res.json({ success: true, message: "Password reset successful!" });
});




/* ================= USER PROFILE ================= */
router.get("/profile", auth(["user"]), (req, res) => {
  res.json({ success: true, message: "Profile Access Granted",
 user: req.user });
});

/* ================= UPDATE PROFILE IMAGE ================= */
router.put(
  "/upload/profile-image",
  auth(["user", "business"]),
  uploadProfileImage,
  async (req, res) => {
    if (!req.file) return sendError(res, 400, "No image");

    const fileUrl = `/uploads/profiles/${req.file.filename}`;
    
    if (req.user.role === "user") {
      await User.findByIdAndUpdate(req.user.id, { profileImage: fileUrl });
    } else {
      await Business.findByIdAndUpdate(req.user.id, { profileImage: fileUrl });
    }

    res.json({ success: true, file: fileUrl });
  }
);



module.exports = router;
