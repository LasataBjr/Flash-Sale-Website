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
