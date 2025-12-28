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
router.get("/:id", auth(["business"]), async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ success: false, message: "Business not found" });

    res.json({ success: true, user: business });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// module.exports = router;




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
